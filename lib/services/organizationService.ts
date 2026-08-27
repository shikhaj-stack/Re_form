import { prisma } from "@/lib/db/prisma";
import { handleDatabaseError } from "@/lib/db/errors";
import { AppError } from "@/lib/security/errors";

export interface CreateOrganizationParams {
  name: string;
  industryType: string;
  location: string;
  verificationStatus?: string;
}

export const organizationService = {
  async getById(id: string) {
    try {
      const org = await prisma.organization.findUnique({
        where: { id },
        include: {
          processorProfile: true,
          _count: {
            select: {
              wasteStreams: true,
              batchesAsSource: true,
              batchesAsProcessor: true,
              users: true,
              marketplaceListings: true,
            },
          },
        },
      });
      if (!org) throw new AppError("Organization not found", 404, "NOT_FOUND");
      return org;
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async listAll(filter?: { verificationStatus?: string }) {
    try {
      return await prisma.organization.findMany({
        where: filter ? { verificationStatus: filter.verificationStatus } : {},
        include: {
          processorProfile: true,
          _count: {
            select: {
              wasteStreams: true,
              users: true,
              marketplaceListings: true,
              batchesAsSource: true,
              batchesAsProcessor: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async updateVerification(id: string, status: "VERIFIED" | "UNVERIFIED" | "SUSPENDED") {
    try {
      return await prisma.organization.update({
        where: { id },
        data: { verificationStatus: status },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },
};
