import { AppError } from "@/lib/security/errors";

export interface ImpactCalculationInput {
  wasteDivertedKg: number;
  wasteType?: string;
}

export interface ImpactCalculationOutput {
  wasteDivertedKg: number;
  materialRecoveredKg: number;
  estimatedCo2ReductionKg: number;
  estimatedCo2ReductionTons: number;
  productsProducedUnits: number;
  waterPreservedLiters: number;
  virginAggregateSavedKg: number;
  disclaimer: string;
}

export const impactEngine = {
  calculate(input: ImpactCalculationInput): ImpactCalculationOutput {
    const rawKg = Number(input.wasteDivertedKg) || 0;

    if (isNaN(rawKg) || rawKg < 0) {
      throw new AppError("Waste diverted mass must be a non-negative number.", 400, "INVALID_INPUT");
    }

    // 82% material recoverability standard
    const materialRecoveredKg = Math.round(rawKg * 0.82);

    // ~0.42 kg CO2e avoided per kg concrete displaced
    const estimatedCo2ReductionKg = Math.round(materialRecoveredKg * 0.42);
    const estimatedCo2ReductionTons = Math.round((estimatedCo2ReductionKg / 1000) * 10) / 10;

    // ~3.5 kg per standard interlocking paver unit
    const productsProducedUnits = Math.floor(materialRecoveredKg / 3.5);

    // ~0.55 Liters water preserved per kg dry-cleaned
    const waterPreservedLiters = Math.round(rawKg * 0.55);

    // ~0.75 kg virgin river sand preserved per kg recycled
    const virginAggregateSavedKg = Math.round(rawKg * 0.75);

    return {
      wasteDivertedKg: rawKg,
      materialRecoveredKg,
      estimatedCo2ReductionKg,
      estimatedCo2ReductionTons,
      productsProducedUnits,
      waterPreservedLiters,
      virginAggregateSavedKg,
      disclaimer:
        "Environmental figures are estimates and require validation through appropriate lifecycle assessment methodology.",
    };
  },
};
