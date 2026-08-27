import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/rbac";
import { auditService } from "@/lib/services/auditService";
import { handleApiError, AppError } from "@/lib/security/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    // Query profile by id or organizationId
    const profile = await prisma.processorProfile.findFirst({
      where: {
        OR: [{ id: params.id }, { organizationId: params.id }],
      },
    });

    if (!profile) {
      throw new AppError("Processor profile not found", 404, "NOT_FOUND");
    }

    // Authorization: only profile owner or admin
    if (user.role !== "ADMIN" && profile.organizationId !== user.organizationId) {
      throw new AppError(
        "Unauthorized: You can only edit your own organization's processor profile.",
        403,
        "FORBIDDEN"
      );
    }

    const body = await req.json();
    const { acceptedMaterials, processingCapabilities, capacity, location, description } = body;

    const updated = await prisma.processorProfile.update({
      where: { id: profile.id },
      data: {
        acceptedMaterials: acceptedMaterials ? JSON.stringify(acceptedMaterials) : undefined,
        processingCapabilities: processingCapabilities || undefined,
        capacity: capacity !== undefined ? Number(capacity) : undefined,
        location: location || undefined,
        description: description || undefined,
      },
    });

    await auditService.log({
      actorId: user.id,
      organizationId: user.organizationId,
      action: "UPDATE_PROCESSOR_PROFILE",
      resourceType: "ProcessorProfile",
      resourceId: profile.id,
      metadata: body,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
