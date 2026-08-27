/**
 * Environmental Impact & Carbon Avoidance Calculator
 * 
 * DISCLAIMER:
 * Prototype Estimate — Requires Scientific Validation & Life-Cycle Assessment (LCA)
 */

export interface EnvironmentalImpactResult {
  landfillDivertedKg: number;
  co2AvoidedTons: number;
  waterPreservedLiters: number;
  virginAggregateSavedKg: number;
  disclaimer: string;
}

export function calculateEnvironmentalImpact(divertedKg: number): EnvironmentalImpactResult {
  // Foundry sand displacement saves ~0.42 kg CO2e / kg
  const co2AvoidedKg = divertedKg * 0.42;
  const co2AvoidedTons = Math.round((co2AvoidedKg / 1000) * 10) / 10;

  // Dry recycling process avoids typical sand-washing water consumption (~55 liters / 100 kg)
  const waterPreservedLiters = Math.round(divertedKg * 0.55);

  // Virgin river sand preserved
  const virginAggregateSavedKg = Math.round(divertedKg * 0.75);

  return {
    landfillDivertedKg: divertedKg,
    co2AvoidedTons,
    waterPreservedLiters,
    virginAggregateSavedKg,
    disclaimer: "Prototype Estimate — Requires Regulatory LCA Validation",
  };
}
