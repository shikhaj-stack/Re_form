import { prisma } from "@/lib/db/prisma";
import { handleDatabaseError } from "@/lib/db/errors";

export interface LogCalculationParams {
  organizationId: string;
  wasteStreamId?: string;
  batchId?: string;
  wasteQuantity: number;
  disposalCost: number;
  processingCost: number;
  expectedProductOutput: number;
  sellingPrice: number;
  estimatedRevenue: number;
  estimatedNetValue: number;
  estimatedValueRecovered: number;
  assumptions?: Record<string, unknown>;
}

export const calculationService = {
  async log(data: LogCalculationParams) {
    try {
      return await prisma.economicCalculation.create({
        data: {
          organizationId: data.organizationId,
          wasteStreamId: data.wasteStreamId || null,
          batchId: data.batchId || null,
          wasteQuantity: data.wasteQuantity,
          disposalCost: data.disposalCost,
          processingCost: data.processingCost,
          expectedProductOutput: data.expectedProductOutput,
          sellingPrice: data.sellingPrice,
          estimatedRevenue: data.estimatedRevenue,
          estimatedNetValue: data.estimatedNetValue,
          estimatedValueRecovered: data.estimatedValueRecovered,
          assumptions: data.assumptions ? JSON.stringify(data.assumptions) : null,
          disclaimer:
            "Illustrative Prototype Calculation — Not a commercial valuation quote",
        },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async list(organizationId?: string) {
    try {
      return await prisma.economicCalculation.findMany({
        where: organizationId ? { organizationId } : {},
        orderBy: { createdAt: "desc" },
        take: 20,
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },
};
