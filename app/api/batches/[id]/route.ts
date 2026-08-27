import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/rbac";
import { batchService } from "@/lib/services/batchService";
import { handleApiError, AppError } from "@/lib/security/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    let batch = null;

    // Support query by UUID/CUID id or batchCode (e.g. RF-2026-001)
    if (params.id.startsWith("RF-")) {
      batch = await batchService.getByCode(params.id);
    } else {
      batch = await prisma.materialBatch.findUnique({
        where: { id: params.id },
        include: {
          sourceOrganization: true,
          processingUnit: true,
          conversionPathway: true,
          wasteStream: true,
          events: { orderBy: { createdAt: "asc" } },
        },
      });
    }

    if (!batch) {
      throw new AppError(`Batch '${params.id}' not found`, 404, "NOT_FOUND");
    }

    // Verify ownership or processor assignment or admin role
    if (user.role !== "ADMIN") {
      const isOwner = batch.sourceOrganizationId === user.organizationId;
      const isProcessor = batch.processingUnitId === user.organizationId;

      if (!isOwner && !isProcessor) {
        throw new AppError("Access forbidden: You are not authorized to view this batch record.", 403, "FORBIDDEN");
      }
    }

    return NextResponse.json({ success: true, data: batch });
  } catch (error) {
    return handleApiError(error);
  }
}
