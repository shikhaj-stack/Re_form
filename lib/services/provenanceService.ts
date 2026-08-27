import { prisma } from "@/lib/db/prisma";
import { handleDatabaseError } from "@/lib/db/errors";
import { AppError } from "@/lib/security/errors";
import { computeProvenanceHash, GENESIS_HASH, verifyProvenanceChain } from "@/lib/security/provenance";
import { transitionPolicy, BatchEventType } from "@/lib/services/transitionPolicy";
import { SessionUser } from "@/types";

export const PERMITTED_ROLE_EVENTS: Record<string, BatchEventType[]> = {
  FACTORY: ["GENERATED", "SOLD"],
  PROCESSOR: ["COLLECTED", "SORTED", "CLEANED", "PROCESSED", "CONVERTED", "TESTED"],
  ADMIN: ["GENERATED", "COLLECTED", "SORTED", "CLEANED", "PROCESSED", "CONVERTED", "TESTED", "SOLD"],
};

export interface CreateProvenanceBatchParams {
  wasteStreamId: string;
  sourceOrganizationId: string;
  quantity: number;
  unit?: string;
  processingUnitId?: string;
  conversionPathwayId?: string;
  destination?: string;
  actor: SessionUser;
}

export interface AppendProvenanceEventParams {
  batchId: string;
  eventType: BatchEventType;
  title?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  actor: SessionUser;
}

export const provenanceService = {
  /**
   * Generates a collision-safe server-side batch code: RF-YYYY-XXX
   */
  generateBatchCode(): string {
    const year = new Date().getFullYear();
    const suffix = Math.floor(100 + Math.random() * 900); // 3-digit numeric code
    return `RF-${year}-${suffix}`;
  },

  /**
   * Asserts whether a given user role is authorized to append a specific event type.
   */
  assertEventAuthorization(role: string, eventType: BatchEventType) {
    const allowed = PERMITTED_ROLE_EVENTS[role] || [];
    if (!allowed.includes(eventType) && role !== "ADMIN") {
      throw new AppError(
        `Role '${role}' is not authorized to register '${eventType}' events. Required actor role: ${
          eventType === "GENERATED" || eventType === "SOLD" ? "FACTORY" : "PROCESSOR"
        }.`,
        403,
        "UNAUTHORIZED_EVENT_TYPE"
      );
    }
  },

  /**
   * Registers a new material batch with the genesis provenance event.
   */
  async createBatch(params: CreateProvenanceBatchParams) {
    try {
      this.assertEventAuthorization(params.actor.role, "GENERATED");

      let batchCode = this.generateBatchCode();
      let exists = await prisma.materialBatch.findUnique({ where: { batchCode } });
      while (exists) {
        batchCode = this.generateBatchCode();
        exists = await prisma.materialBatch.findUnique({ where: { batchCode } });
      }

      const timestamp = new Date().toISOString();
      const meta = {
        registeredByOrg: params.actor.organizationName,
        sourceLocation: params.destination || "Indore Facility",
      };

      const genesisHash = computeProvenanceHash({
        previousHash: GENESIS_HASH,
        batchId: batchCode,
        eventType: "GENERATED",
        timestamp,
        metadata: meta,
      });

      return await prisma.materialBatch.create({
        data: {
          batchCode,
          wasteStreamId: params.wasteStreamId,
          sourceOrganizationId: params.sourceOrganizationId,
          quantity: params.quantity,
          unit: params.unit || "KG",
          processingUnitId: params.processingUnitId || null,
          conversionPathwayId: params.conversionPathwayId || null,
          destination: params.destination || null,
          currentStatus: "GENERATED",
          events: {
            create: {
              eventType: "GENERATED",
              title: "Material Batch Initialized",
              description: `Batch of ${params.quantity.toLocaleString()} ${params.unit || "KG"} registered at source.`,
              actorId: params.actor.id,
              metadata: JSON.stringify({
                ...meta,
                sha256Hash: genesisHash,
                previousHash: GENESIS_HASH,
              }),
            },
          },
        },
        include: {
          events: true,
          sourceOrganization: true,
          processingUnit: true,
        },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  /**
   * Appends an immutable checkpoint to a material batch.
   * Computes the next chained SHA-256 hash.
   */
  async appendEvent(params: AppendProvenanceEventParams) {
    try {
      this.assertEventAuthorization(params.actor.role, params.eventType);

      const batch = await prisma.materialBatch.findFirst({
        where: { OR: [{ id: params.batchId }, { batchCode: params.batchId }] },
        include: { events: { orderBy: { createdAt: "asc" } } },
      });

      if (!batch) {
        throw new AppError(`Batch '${params.batchId}' not found`, 404, "NOT_FOUND");
      }

      // Check organization authority
      if (params.actor.role !== "ADMIN") {
        if (params.eventType === "GENERATED" || params.eventType === "SOLD") {
          if (batch.sourceOrganizationId !== params.actor.organizationId) {
            throw new AppError("Only the source factory organization can register this event.", 403, "FORBIDDEN");
          }
        } else {
          if (batch.processingUnitId && batch.processingUnitId !== params.actor.organizationId) {
            throw new AppError("Only the assigned processor facility can log processing milestones.", 403, "FORBIDDEN");
          }
        }
      }

      // FSM Transition Validation
      transitionPolicy.assertTransition(batch.currentStatus, params.eventType, params.actor.role === "ADMIN");

      // Determine previous hash
      let lastHash = GENESIS_HASH;
      if (batch.events.length > 0) {
        const lastEv = batch.events[batch.events.length - 1];
        if (lastEv.metadata) {
          try {
            const parsed = typeof lastEv.metadata === "string" ? JSON.parse(lastEv.metadata) : lastEv.metadata;
            lastHash = parsed.sha256Hash || parsed.sha256Signature || GENESIS_HASH;
          } catch {
            lastHash = GENESIS_HASH;
          }
        }
      }

      const timestamp = new Date().toISOString();
      const pureMeta = params.metadata || {};

      const currentHash = computeProvenanceHash({
        previousHash: lastHash,
        batchId: batch.batchCode,
        eventType: params.eventType,
        timestamp,
        metadata: pureMeta,
      });

      return await prisma.$transaction(async (tx) => {
        const event = await tx.batchEvent.create({
          data: {
            batchId: batch.id,
            eventType: params.eventType,
            title: params.title || `Milestone ${params.eventType} Recorded`,
            description: params.description || `Verified by ${params.actor.name}`,
            actorId: params.actor.id,
            metadata: JSON.stringify({
              ...pureMeta,
              sha256Hash: currentHash,
              previousHash: lastHash,
              actorOrg: params.actor.organizationName,
              timestamp,
            }),
          },
        });

        const updateData: any = { currentStatus: params.eventType };
        if (!batch.processingUnitId && params.actor.role === "PROCESSOR") {
          updateData.processingUnitId = params.actor.organizationId;
        }

        await tx.materialBatch.update({
          where: { id: batch.id },
          data: updateData,
        });

        return { event, currentHash, previousHash: lastHash };
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  /**
   * Retrieves ordered event history and validates integrity.
   */
  async getProvenanceHistory(batchIdentifier: string) {
    try {
      const batch = await prisma.materialBatch.findFirst({
        where: { OR: [{ id: batchIdentifier }, { batchCode: batchIdentifier }] },
        include: {
          sourceOrganization: { select: { id: true, name: true, location: true } },
          processingUnit: { select: { id: true, name: true, location: true } },
          conversionPathway: true,
          wasteStream: true,
          events: { orderBy: { createdAt: "asc" } },
        },
      });

      if (!batch) {
        throw new AppError(`Batch '${batchIdentifier}' not found`, 404, "NOT_FOUND");
      }

      const verification = verifyProvenanceChain(batch.events);

      return {
        batch: {
          id: batch.id,
          batchCode: batch.batchCode,
          wasteType: batch.wasteStream.wasteType,
          quantity: batch.quantity,
          unit: batch.unit,
          currentStatus: batch.currentStatus,
          sourceOrganization: batch.sourceOrganization,
          processingUnit: batch.processingUnit,
          productBatchCode: batch.productBatchCode,
          testingStatus: batch.testingStatus,
          destination: batch.destination,
        },
        events: batch.events.map((ev) => {
          let meta: any = {};
          try {
            meta = ev.metadata ? (typeof ev.metadata === "string" ? JSON.parse(ev.metadata) : ev.metadata) : {};
          } catch {}

          return {
            id: ev.id,
            eventType: ev.eventType,
            title: ev.title,
            description: ev.description,
            timestamp: ev.createdAt,
            actorOrg: meta.actorOrg || batch.sourceOrganization?.name,
            sha256Hash: meta.sha256Hash || meta.sha256Signature || "0x...",
            previousHash: meta.previousHash || GENESIS_HASH,
          };
        }),
        verification,
        disclaimer:
          "This prototype uses database-backed event provenance and optional integrity hashing. A production blockchain or distributed ledger integration would require a separate ledger infrastructure.",
      };
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },
};
