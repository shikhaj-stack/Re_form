import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, assertOwnership } from "@/lib/auth/rbac";
import { wasteStreamService } from "@/lib/services/wasteStreamService";
import { auditService } from "@/lib/services/auditService";
import { handleApiError, AppError } from "@/lib/security/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const stream = await wasteStreamService.getById(params.id);

    assertOwnership(user, stream.organizationId);

    return NextResponse.json({ success: true, data: stream });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const stream = await wasteStreamService.getById(params.id);

    assertOwnership(user, stream.organizationId);

    const body = await req.json();
    const updated = await prisma.wasteStream.update({
      where: { id: params.id },
      data: {
        quantity: body.quantity !== undefined ? Number(body.quantity) : undefined,
        currentDisposalMethod: body.currentDisposalMethod || undefined,
        contaminationLevel: body.contaminationLevel || undefined,
        status: body.status || undefined,
      },
    });

    await auditService.log({
      actorId: user.id,
      organizationId: user.organizationId,
      action: "UPDATE_WASTE_STREAM",
      resourceType: "WasteStream",
      resourceId: stream.id,
      metadata: body,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const stream = await wasteStreamService.getById(params.id);

    assertOwnership(user, stream.organizationId);

    // Deliberate deletion rules: softly mark archived or delete if no active batches
    const activeBatchesCount = await prisma.materialBatch.count({
      where: { wasteStreamId: params.id },
    });

    if (activeBatchesCount > 0) {
      throw new AppError(
        "Cannot delete a waste stream with active downstream batches. You may archive the stream instead.",
        400,
        "DEPENDENCY_EXISTS"
      );
    }

    await prisma.wasteStream.delete({ where: { id: params.id } });

    await auditService.log({
      actorId: user.id,
      organizationId: user.organizationId,
      action: "DELETE_WASTE_STREAM",
      resourceType: "WasteStream",
      resourceId: params.id,
    });

    return NextResponse.json({ success: true, message: "Waste stream removed successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
