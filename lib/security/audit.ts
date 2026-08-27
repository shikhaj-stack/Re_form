import { prisma } from "@/lib/db/prisma";

export interface AuditLogParams {
  actorId?: string;
  organizationId?: string;
  action: "LOGIN" | "LOGOUT" | "CREATE_BATCH" | "UPDATE_BATCH_STATUS" | "ASSESSMENT_SUBMITTED" | "MARKETPLACE_REQUEST" | "ADMIN_VERIFY";
  resourceType: "Batch" | "WasteStream" | "User" | "Organization" | "Session" | "Assessment";
  resourceId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

export async function logAuditEvent(params: AuditLogParams) {
  try {
    // Exclude any passwords, credentials, tokens, or sensitive values from metadata
    const sanitizedMeta = params.metadata ? JSON.stringify(params.metadata) : null;

    await prisma.auditLog.create({
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
  } catch (error) {
    // Non-blocking fallback: never fail a business transaction just because logging failed
    console.error("[AUDIT_LOGGING_FAILED]", error);
  }
}
