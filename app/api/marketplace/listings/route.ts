import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
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
    return NextResponse.json({ success: true, data: listings || [] });
  } catch (error) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await req.json();
    const { wasteStreamId, title, quantity, unit, location } = body;

    if (!wasteStreamId || !title || !quantity) {
      throw new AppError("wasteStreamId, title, and quantity are required.", 400);
    }

    // Verify waste stream belongs to the user's organization
    const stream = await prisma.wasteStream.findUnique({
      where: { id: wasteStreamId },
    });

    if (!stream) {
      throw new AppError("Waste stream not found.", 404);
    }

    if (user.role !== "ADMIN" && stream.organizationId !== user.organizationId) {
      throw new AppError("You can only create marketplace listings for your own organization's waste streams.", 403, "FORBIDDEN");
    }

    const listing = await marketplaceService.createListing({
      organizationId: user.organizationId,
      wasteStreamId,
      title,
      quantity: Number(quantity),
      unit: unit || "KG",
      location: location || stream.location,
    });

    await auditService.log({
      actorId: user.id,
      organizationId: user.organizationId,
      action: "CREATE_LISTING",
      resourceType: "MarketplaceListing",
      resourceId: listing.id,
      metadata: { title, quantity },
    });

    return NextResponse.json({ success: true, data: listing }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
