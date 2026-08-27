import { prisma } from "@/lib/db/prisma";
import { handleDatabaseError } from "@/lib/db/errors";

export interface CreateAssessmentParams {
  wasteStreamId: string;
  recoverabilityEstimate: number;
  recommendedPathwayId?: string;
  potentialProduct: string;
  confidenceLevel?: string;
  disclaimer?: string;
}

export const assessmentService = {
  async create(data: CreateAssessmentParams) {
    try {
      return await prisma.wasteAssessment.create({
        data: {
          wasteStreamId: data.wasteStreamId,
          recoverabilityEstimate: data.recoverabilityEstimate,
          recommendedPathwayId: data.recommendedPathwayId || null,
          potentialProduct: data.potentialProduct,
          confidenceLevel: data.confidenceLevel || "PROTOTYPE_CONFIDENCE",
          disclaimer:
            data.disclaimer || "Prototype Estimate — Requires Material Testing",
        },
        include: {
          recommendedPathway: true,
          wasteStream: { include: { organization: true } },
        },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async listRecent(organizationId?: string) {
    try {
      return await prisma.wasteAssessment.findMany({
        where: organizationId
          ? { wasteStream: { organizationId } }
          : {},
        include: {
          recommendedPathway: true,
          wasteStream: { include: { organization: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 25,
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },
};
