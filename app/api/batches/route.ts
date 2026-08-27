import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { requireAuth } from "@/lib/auth/rbac";
import { batchService } from "@/lib/services/batchService";
import { auditService } from "@/lib/services/auditService";
import { CreateBatchSchema, UpdateBatchStatusSchema } from "@/lib/validation/batch.schema";
import { handleApiError, AppError } from "@/lib/security/errors";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const batchCode = searchParams.get("batchNumber") || searchParams.get("batchCode");

    if (batchCode) {
      const singleBatch = await batchService.getByCode(batchCode);
      return NextResponse.json({ success: true, data: singleBatch });
    }

    const user = await getCurrentUser();
    const batches = await batchService.list(user?.organizationId, user?.role);

    return NextResponse.json({ success: true, data: batches });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    if (user.role !== "FACTORY" && user.role !== "ADMIN") {
      throw new AppError("Only factory waste generators or admins can register batches", 403, "FORBIDDEN");
    }

    const body = await req.json();
    const validated = CreateBatchSchema.parse(body);

    const batch = await batchService.create({
      wasteStreamId: validated.wasteStreamId,
      sourceOrganizationId: user.organizationId,
      quantity: validated.quantityKg,
      unit: "KG",
      processingUnitId: validated.processorOrgId,
      actorId: user.id,
    });

    await auditService.log({
      actorId: user.id,
      organizationId: user.organizationId,
      action: "CREATE_BATCH",
      resourceType: "Batch",
      resourceId: batch.id,
      metadata: { batchCode: batch.batchCode, quantity: batch.quantity },
    });

    return NextResponse.json({ success: true, data: batch });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const validated = UpdateBatchStatusSchema.parse(body);

    const event = await batchService.appendEvent({
      batchId: validated.batchId,
      eventType: validated.status as any,
      title: `Status Updated to ${validated.status}`,
      description: validated.notes || `Checkpoint logged by ${user.name}`,
      actorId: user.id,
      metadata: { sha256Signature: `0x${Math.random().toString(16).substring(2, 10)}` },
    });

    await auditService.log({
      actorId: user.id,
      organizationId: user.organizationId,
      action: "UPDATE_BATCH_STATUS",
      resourceType: "Batch",
      resourceId: validated.batchId,
      metadata: { eventType: validated.status },
    });

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return handleApiError(error);
  }
}
