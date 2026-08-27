import { AppError } from "@/lib/security/errors";

export interface EconomicCalculationInput {
  wasteQuantity: number;
  currentDisposalCost: number;
  processingCost: number;
  expectedProductOutput: number;
  productSellingPrice: number;
}

export interface EconomicCalculationOutput {
  currentWasteCost: number;
  processingCostTotal: number;
  potentialProductRevenue: number;
  estimatedNetValue: number;
  potentialValueRecovered: number;
  currency: string;
  disclaimer: string;
}

export const economicEngine = {
  calculate(input: EconomicCalculationInput): EconomicCalculationOutput {
    const {
      wasteQuantity,
      currentDisposalCost,
      processingCost,
      expectedProductOutput,
      productSellingPrice,
    } = input;

    if (
      isNaN(wasteQuantity) ||
      isNaN(currentDisposalCost) ||
      isNaN(processingCost) ||
      isNaN(expectedProductOutput) ||
      isNaN(productSellingPrice)
    ) {
      throw new AppError("All calculation parameters must be valid numeric quantities.", 400, "NAN_DISALLOWED");
    }

    if (
      wasteQuantity < 0 ||
      currentDisposalCost < 0 ||
      processingCost < 0 ||
      expectedProductOutput < 0 ||
      productSellingPrice < 0
    ) {
      throw new AppError("Calculation inputs cannot be negative values.", 400, "NEGATIVE_VALUES_DISALLOWED");
    }

    if (wasteQuantity > 100000000) {
      throw new AppError("Quantity exceeds prototype maximum threshold (100M kg).", 400, "THRESHOLD_EXCEEDED");
    }

    // Formulas strictly adhering to specification:
    // currentWasteCost = wasteQuantity × currentDisposalCost
    const currentWasteCost = Math.round(wasteQuantity * currentDisposalCost);

    // processingCostTotal = wasteQuantity × processingCost
    const processingCostTotal = Math.round(wasteQuantity * processingCost);

    // potentialProductRevenue = expectedProductOutput × productSellingPrice
    const potentialProductRevenue = Math.round(expectedProductOutput * productSellingPrice);

    // estimatedNetValue = potentialProductRevenue - processingCostTotal
    const estimatedNetValue = potentialProductRevenue - processingCostTotal;

    // potentialValueRecovered = estimatedNetValue + currentWasteCost
    const potentialValueRecovered = estimatedNetValue + currentWasteCost;

    return {
      currentWasteCost,
      processingCostTotal,
      potentialProductRevenue,
      estimatedNetValue,
      potentialValueRecovered,
      currency: "INR",
      disclaimer: "Illustrative prototype calculation — not a commercial quotation.",
    };
  },
};
