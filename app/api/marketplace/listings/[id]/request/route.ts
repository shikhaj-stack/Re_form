import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/rbac";
import { auditService } from "@/lib/services/auditService";
import { handleApiError, AppError } from "@/lib/security/errors";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    const listing = await prisma.marketplaceListing.findUnique({
      where: { id: params.id },
    });

    if (!listing) {
      throw new AppError("Marketplace listing not found.", 404, "NOT_FOUND");
    }

    // Constraint 1: Prevent requests for closed listings
    if (listing.status !== "AVAILABLE") {
      throw new AppError(
        `This listing is currently '${listing.status}' and not open for new allocation requests.`,
        400,
        "LISTING_UNAVAILABLE"
      );
    }

    // Constraint 2: Prevent requesting own listing
    if (listing.organizationId === user.organizationId) {
      throw new AppError(
        "An enterprise is not permitted to submit a procurement request for its own waste listing.",
        400,
        "SELF_REQUEST_PROHIBITED"
      );
    }

    // Constraint 3: Prevent duplicate active requests
    const existingRequest = await prisma.marketplaceRequest.findFirst({
      where: {
        listingId: params.id,
        requesterOrganizationId: user.organizationId,
        status: { in: ["PENDING", "ACCEPTED"] },
      },
    });

    if (existingRequest) {
      throw new AppError(
        "Your organization already has an active pending or accepted request for this listing.",
        409,
        "DUPLICATE_REQUEST_PROHIBITED"
      );
    }

    const body = await req.json().catch(() => ({}));
    const message = body.message || null;

    const request = await prisma.marketplaceRequest.create({
      data: {
        listingId: params.id,
        requesterOrganizationId: user.organizationId,
        message,
        status: "PENDING",
      },
      include: {
        listing: true,
        requesterOrganization: true,
      },
    });

    await auditService.log({
      actorId: user.id,
      organizationId: user.organizationId,
      action: "MARKETPLACE_REQUEST",
      resourceType: "MarketplaceRequest",
      resourceId: request.id,
      metadata: { listingId: params.id },
    });

    return NextResponse.json(
      {
        success: true,
        data: request,
        message: "Material allocation request transmitted to host facility node.",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
