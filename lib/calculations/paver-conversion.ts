/**
 * RE-FORM Core Demonstration Conversion Pathway Calculations:
 * Foundry Sand + Suitable Waste Plastic Matrix -> Recycled Construction Pavers
 * 
 * DISCLAIMER:
 * Prototype estimates for demonstration purposes only.
 * Requires laboratory mechanical compressive testing (IS 15658) and regulatory approval before industrial deployment.
 */

export interface PaverYieldResult {
  inputSandKg: number;
  requiredPlasticKg: number;
  recoveredRatio: number;
  producedPaverUnits: number;
  avgPaverWeightKg: number;
  co2OffsetKg: number;
  disclaimer: string;
}

export function calculatePaverConversion(sandKg: number): PaverYieldResult {
  // Standard ratio: 75% Foundry Sand, 25% Waste Polymer binder
  const requiredPlasticKg = sandKg * (25 / 75);
  const totalRawMassKg = sandKg + requiredPlasticKg;
  
  // High-efficiency composite recovery ratio (82% - 85% effective yield)
  const recoveryRatio = 0.82;
  const netMouldedMassKg = totalRawMassKg * recoveryRatio;
  
  // Standard interlocking paver block weight ~ 3.5 kg / unit
  const paverUnitWeight = 3.5;
  const paverCount = Math.floor(netMouldedMassKg / paverUnitWeight);
  
  // Environmental offset metric: ~0.42 kg CO2 avoided per kg virgin concrete displaced
  const co2OffsetKg = netMouldedMassKg * 0.42;

  return {
    inputSandKg: sandKg,
    requiredPlasticKg: Math.round(requiredPlasticKg * 10) / 10,
    recoveredRatio: recoveryRatio,
    producedPaverUnits: paverCount,
    avgPaverWeightKg: paverUnitWeight,
    co2OffsetKg: Math.round(co2OffsetKg),
    disclaimer: "Prototype Estimate — Requires Laboratory Validation",
  };
}
