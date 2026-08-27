import { prisma } from "@/lib/db/prisma";
import { handleDatabaseError } from "@/lib/db/errors";
import { AppError } from "@/lib/security/errors";

export const pathwayService = {
  async listActive() {
    try {
      return await prisma.conversionPathway.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: {
              assessments: true,
              batches: true,
            },
          },
        },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async listAll() {
    try {
      return await prisma.conversionPathway.findMany({
        orderBy: [{ isActive: "desc" }, { name: "asc" }],
        include: {
          _count: {
            select: {
              assessments: true,
              batches: true,
            },
          },
        },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async getById(id: string) {
    try {
      const pathway = await prisma.conversionPathway.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              assessments: true,
              batches: true,
            },
          },
        },
      });
      if (!pathway) throw new AppError("Conversion pathway not found", 404, "NOT_FOUND");
      return pathway;
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async findByInput(inputMaterial: string) {
    try {
      return await prisma.conversionPathway.findFirst({
        where: { inputMaterial, isActive: true },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async toggleActive(id: string, isActive: boolean) {
    try {
      return await prisma.conversionPathway.update({
        where: { id },
        data: { isActive },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async updateValidationStatus(id: string, validationStatus: string) {
    try {
      return await prisma.conversionPathway.update({
        where: { id },
        data: { validationStatus },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },
};
