import { prisma } from "@/lib/db/prisma";
import { handleDatabaseError } from "@/lib/db/errors";
import { AppError } from "@/lib/security/errors";

export interface CreateListingParams {
  organizationId: string;
  wasteStreamId: string;
  title: string;
  quantity: number;
  unit?: string;
  location: string;
}

export interface CreateRequestParams {
  listingId: string;
  requesterOrganizationId: string;
  message?: string;
}

export const marketplaceService = {
  async listListings(status = "AVAILABLE") {
    try {
      return await prisma.marketplaceListing.findMany({
        where: status === "ALL" ? {} : { status },
        include: {
          organization: true,
          wasteStream: true,
          requests: { include: { requesterOrganization: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async listAllAdmin() {
    try {
      return await prisma.marketplaceListing.findMany({
        include: {
          organization: true,
          wasteStream: true,
          requests: {
            include: {
              requesterOrganization: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async listProcessors() {
    try {
      return await prisma.processorProfile.findMany({
        include: { organization: true },
        orderBy: { capacity: "desc" },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async createListing(data: CreateListingParams) {
    try {
      return await prisma.marketplaceListing.create({
        data: {
          organizationId: data.organizationId,
          wasteStreamId: data.wasteStreamId,
          title: data.title,
          quantity: data.quantity,
          unit: data.unit || "KG",
          location: data.location,
          status: "AVAILABLE",
        },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async updateListingStatus(id: string, status: "AVAILABLE" | "RESERVED" | "CLOSED") {
    try {
      return await prisma.marketplaceListing.update({
        where: { id },
        data: { status },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  /**
   * Request Material Allocation
   * Rule: Prevent organizations from requesting their own listing.
   */
  async createRequest(data: CreateRequestParams) {
    try {
      const listing = await prisma.marketplaceListing.findUnique({
        where: { id: data.listingId },
      });

      if (!listing) {
        throw new AppError("Listing not found", 404, "NOT_FOUND");
      }

      if (listing.organizationId === data.requesterOrganizationId) {
        throw new AppError(
          "An enterprise cannot submit a procurement request for its own waste listing.",
          400,
          "SELF_REQUEST_PROHIBITED"
        );
      }

      return await prisma.marketplaceRequest.create({
        data: {
          listingId: data.listingId,
          requesterOrganizationId: data.requesterOrganizationId,
          message: data.message || null,
          status: "PENDING",
        },
        include: {
          listing: true,
          requesterOrganization: true,
        },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },
};
