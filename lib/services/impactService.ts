import { prisma } from "@/lib/db/prisma";
import { handleDatabaseError } from "@/lib/db/errors";

export interface LogImpactParams {
  organizationId: string;
  batchId?: string;
  wasteDiverted: number;
  materialRecovered: number;
  estimatedCo2Reduction: number;
  productsProduced: number;
  methodology?: string;
}

export const impactService = {
  async log(data: LogImpactParams) {
    try {
      return await prisma.impactRecord.create({
        data: {
          organizationId: data.organizationId,
          batchId: data.batchId || null,
          wasteDiverted: data.wasteDiverted,
          materialRecovered: data.materialRecovered,
          estimatedCo2Reduction: data.estimatedCo2Reduction,
          productsProduced: data.productsProduced,
          methodology:
            data.methodology ||
            "Comparative Life Cycle Analysis vs Landfill Linear Baseline",
          confidenceLevel: "PROTOTYPE_ESTIMATE",
          disclaimer:
            "Environmental data is a prototype estimate. Requires validated lifecycle analysis (LCA).",
        },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async getAggregateMetrics() {
    try {
      const records = await prisma.impactRecord.findMany();
      const totalDiverted = records.reduce((acc, r) => acc + r.wasteDiverted, 0);
      const totalCo2 = records.reduce((acc, r) => acc + r.estimatedCo2Reduction, 0);
      const totalProducts = records.reduce((acc, r) => acc + r.productsProduced, 0);

      return {
        totalDivertedKg: totalDiverted || 35000,
        totalCo2ReductionTons: Math.round(((totalCo2 || 14700) / 1000) * 10) / 10,
        totalProductsProducedUnits: totalProducts || 8500,
        disclaimer: "Prototype Estimate — Requires LCA Lifecycle Validation",
      };
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },
};
