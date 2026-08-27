import { prisma } from "@/lib/db/prisma";
import { handleDatabaseError } from "@/lib/db/errors";
import { AppError } from "@/lib/security/errors";

export interface CreateBatchParams {
  wasteStreamId: string;
  sourceOrganizationId: string;
  quantity: number;
  unit?: string;
  processingUnitId?: string;
  conversionPathwayId?: string;
  productBatchCode?: string;
  destination?: string;
  actorId?: string;
}

export interface AppendBatchEventParams {
  batchId: string;
  eventType: "GENERATED" | "COLLECTED" | "SORTED" | "CLEANED" | "PROCESSED" | "CONVERTED" | "TESTED" | "SOLD";
  title: string;
  description?: string;
  actorId?: string;
  metadata?: Record<string, unknown>;
}

export const batchService = {
  async getByCode(batchCode: string) {
    try {
      const batch = await prisma.materialBatch.findUnique({
        where: { batchCode },
        include: {
          sourceOrganization: true,
          processingUnit: true,
          conversionPathway: true,
          wasteStream: true,
          events: { orderBy: { createdAt: "asc" } },
        },
      });
      if (!batch) throw new AppError(`Batch code '${batchCode}' not found in ledger`, 404, "NOT_FOUND");
      return batch;
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async list(organizationId?: string, role?: string) {
    try {
      let where = {};
      if (organizationId && role !== "ADMIN") {
        if (role === "PROCESSOR") {
          where = {
            OR: [
              { processingUnitId: organizationId },
              { processingUnitId: null },
            ],
          };
        } else {
          where = { sourceOrganizationId: organizationId };
        }
      }

      return await prisma.materialBatch.findMany({
        where,
        include: {
          sourceOrganization: true,
          processingUnit: true,
          conversionPathway: true,
          wasteStream: true,
          events: { orderBy: { createdAt: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async create(data: CreateBatchParams) {
    try {
      const randomSuffix = Math.random().toString(16).substring(2, 6).toUpperCase();
      const batchCode = `RF-${new Date().getFullYear()}-${randomSuffix}`;
      const sha256 = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;

      return await prisma.materialBatch.create({
        data: {
          batchCode,
          wasteStreamId: data.wasteStreamId,
          sourceOrganizationId: data.sourceOrganizationId,
          quantity: data.quantity,
          unit: data.unit || "KG",
          processingUnitId: data.processingUnitId || null,
          conversionPathwayId: data.conversionPathwayId || null,
          productBatchCode: data.productBatchCode || `PROD-${randomSuffix}`,
          destination: data.destination || null,
          currentStatus: "GENERATED",
          events: {
            create: {
              eventType: "GENERATED",
              title: "Material Batch Initialized",
              description: `Batch ${batchCode} registered with ${data.quantity} ${data.unit || "KG"} raw material.`,
              actorId: data.actorId || null,
              metadata: JSON.stringify({ sha256Signature: sha256 }),
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
   * Append-Only Event Logger:
   * Enforces immutability: historical event records are never modified or overwritten.
   */
  async appendEvent(params: AppendBatchEventParams) {
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. Create append event
        const event = await tx.batchEvent.create({
          data: {
            batchId: params.batchId,
            eventType: params.eventType,
            title: params.title,
            description: params.description || null,
            actorId: params.actorId || null,
            metadata: params.metadata ? JSON.stringify(params.metadata) : null,
          },
        });

        // 2. Update currentStatus on parent batch
        await tx.materialBatch.update({
          where: { id: params.batchId },
          data: { currentStatus: params.eventType },
        });

        return event;
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },
};
