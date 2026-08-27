import { prisma } from "@/lib/db/prisma";
import { handleDatabaseError } from "@/lib/db/errors";
import { AppError } from "@/lib/security/errors";

export interface CreateWasteStreamParams {
  organizationId: string;
  wasteType: string;
  quantity: number;
  unit?: string;
  generationFrequency?: string;
  contaminationLevel?: string;
  currentDisposalMethod: string;
  location: string;
}

export const wasteStreamService = {
  async create(data: CreateWasteStreamParams) {
    try {
      return await prisma.wasteStream.create({
        data: {
          organizationId: data.organizationId,
          wasteType: data.wasteType,
          quantity: data.quantity,
          unit: data.unit || "KG",
          generationFrequency: data.generationFrequency || "MONTHLY",
          contaminationLevel: data.contaminationLevel || "LOW",
          currentDisposalMethod: data.currentDisposalMethod,
          location: data.location,
        },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async listByOrganization(organizationId?: string) {
    try {
      return await prisma.wasteStream.findMany({
        where: organizationId ? { organizationId } : {},
        include: {
          organization: true,
          assessments: true,
          batches: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async getById(id: string) {
    try {
      const stream = await prisma.wasteStream.findUnique({
        where: { id },
        include: {
          organization: true,
          assessments: { include: { recommendedPathway: true } },
          batches: true,
        },
      });
      if (!stream) throw new AppError("Waste stream not found", 404, "NOT_FOUND");
      return stream;
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },
};
