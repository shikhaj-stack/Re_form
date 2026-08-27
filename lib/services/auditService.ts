import { prisma } from "@/lib/db/prisma";

export interface LogAuditParams {
  actorId?: string;
  organizationId?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

export interface ListAuditParams {
  limit?: number;
  action?: string;
  resourceType?: string;
  actorId?: string;
}

export const auditService = {
  async log(params: LogAuditParams) {
    try {
      const sanitizedMeta = params.metadata
        ? JSON.stringify(params.metadata)
        : null;

      return await prisma.auditLog.create({
        data: {
          actorId: params.actorId || null,
          organizationId: params.organizationId || null,
          action: params.action,
          resourceType: params.resourceType,
          resourceId: params.resourceId,
          metadata: sanitizedMeta,
          ipAddress: params.ipAddress || "127.0.0.1",
        },
      });
    } catch (e) {
      console.error("[AUDIT_LOG_ERROR]", e);
    }
  },

  async listRecent(limit = 30, filters?: { action?: string; resourceType?: string }) {
    try {
      const where: Record<string, unknown> = {};
      if (filters?.action) where.action = filters.action;
      if (filters?.resourceType) where.resourceType = filters.resourceType;

      const logs = await prisma.auditLog.findMany({
        where,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          action: true,
          resourceType: true,
          resourceId: true,
          metadata: true,
          ipAddress: true,
          createdAt: true,
          actor: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
              industryType: true,
            },
          },
        },
      });

      return logs.map((log) => ({
        ...log,
        timestamp: log.createdAt,
      }));
    } catch (e) {
      console.error("[AUDIT_FETCH_ERROR]", e);
      return [];
    }
  },
};
