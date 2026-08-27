import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { requireAuth } from "@/lib/auth/rbac";
import { marketplaceService } from "@/lib/services/marketplaceService";
import { auditService } from "@/lib/services/auditService";
import { handleApiError, AppError } from "@/lib/security/errors";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(req: NextRequest) {
  try {
    const listings = await marketplaceService.listListings("AVAILABLE");
    const processors = await marketplaceService.listProcessors();

    return NextResponse.json({
      success: true,
      data: {
        availableStreams: listings || [],
        processors: (processors || []).map((p) => ({
          id: p.organizationId,
          name: p.organization.name,
          location: p.location,
          acceptedMaterials: p.acceptedMaterials,
          processingCapabilities: p.processingCapabilities,
          capacity: p.capacity,
          verificationStatus: p.verificationStatus,
          description: p.description,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      data: { availableStreams: [], processors: [] },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { listingId, message } = body;

    if (!listingId) {
      throw new AppError("Listing ID is required to submit a procurement request.", 400);
    }

    const request = await marketplaceService.createRequest({
      listingId,
      requesterOrganizationId: user.organizationId,
      message,
    });

    await auditService.log({
      actorId: user.id,
      organizationId: user.organizationId,
      action: "MARKETPLACE_REQUEST",
      resourceType: "MarketplaceRequest",
      resourceId: request.id,
      metadata: { listingId },
    });

    return NextResponse.json({
      success: true,
      data: request,
      message: "Allocation request transmitted to verified processor node.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
