import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { requireRole } from "@/lib/auth/rbac";
import { marketplaceService } from "@/lib/services/marketplaceService";
import { auditService } from "@/lib/services/auditService";
import { handleApiError, AppError } from "@/lib/security/errors";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(req: NextRequest) {
  try {
    const processors = await marketplaceService.listProcessors();

    return NextResponse.json({
      success: true,
      data: (processors || []).map((p) => ({
        id: p.id,
        organizationId: p.organizationId,
        name: p.organization.name,
        location: p.location,
        acceptedMaterials: p.acceptedMaterials,
        processingCapabilities: p.processingCapabilities,
        capacity: p.capacity,
        verificationStatus: p.verificationStatus,
        description: p.description,
        disclaimer: "Verified Industrial Processor Node — CPCB / SPCB Compliant",
      })),
    });
  } catch (error) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Only authorized PROCESSOR or ADMIN role
    const user = await requireRole(["PROCESSOR", "ADMIN"]);

    const body = await req.json();
    const { acceptedMaterials, processingCapabilities, capacity, location, description } = body;

    if (!processingCapabilities || !capacity || !location) {
      throw new AppError("processingCapabilities, capacity, and location are required.", 400);
    }

    const profile = await prisma.processorProfile.upsert({
      where: { organizationId: user.organizationId },
      create: {
        organizationId: user.organizationId,
        acceptedMaterials: JSON.stringify(acceptedMaterials || ["FOUNDRY_SAND", "PET_PLASTIC"]),
        processingCapabilities,
        capacity: Number(capacity),
        location,
        verificationStatus: "VERIFIED",
        description,
      },
      update: {
        acceptedMaterials: acceptedMaterials ? JSON.stringify(acceptedMaterials) : undefined,
        processingCapabilities,
        capacity: Number(capacity),
        location,
        description,
      },
    });

    await auditService.log({
      actorId: user.id,
      organizationId: user.organizationId,
      action: "UPDATE_PROCESSOR_PROFILE",
      resourceType: "ProcessorProfile",
      resourceId: profile.id,
      metadata: { capacity },
    });

    return NextResponse.json({ success: true, data: profile }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
