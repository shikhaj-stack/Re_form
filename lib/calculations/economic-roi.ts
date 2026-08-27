/**
 * Interactive Economic ROI Calculator
 * 
 * DISCLAIMER:
 * Illustrative prototype calculation — not a commercial valuation quote.
 */

export interface RoiCalculatorParams {
  wasteMassKg: number;
  baselineDisposalSurchargePerKg: number; // e.g. 15 INR/kg
  processingOverheadPerKg: number;        // e.g. 8 INR/kg
  finishedProductYieldPercent: number;    // e.g. 85%
  targetAssetUnitResaleValue: number;     // e.g. 45 INR/kg
}

export interface RoiCalculatorResult {
  currentWasteLiability: number;
  totalProcessingCost: number;
  finishedProductMassKg: number;
  expectedGrossRevenue: number;
  netEconomicYield: number;
  totalValueRecaptured: number;
  disclaimer: string;
}

export function calculateEconomicRoi(params: RoiCalculatorParams): RoiCalculatorResult {
  const {
    wasteMassKg,
    baselineDisposalSurchargePerKg,
    processingOverheadPerKg,
    finishedProductYieldPercent,
    targetAssetUnitResaleValue,
  } = params;

  // 1. Current Cost of simply discarding to landfill
  const currentWasteLiability = wasteMassKg * baselineDisposalSurchargePerKg;

  // 2. Cost to collect & mechanically process
  const totalProcessingCost = wasteMassKg * processingOverheadPerKg;

  // 3. Product yield
  const finishedProductMassKg = wasteMassKg * (finishedProductYieldPercent / 100);

  // 4. Gross sales revenue
  const expectedGrossRevenue = finishedProductMassKg * targetAssetUnitResaleValue;

  // 5. Net Economic Gain = Gross Revenue - Processing Cost
  const netEconomicYield = expectedGrossRevenue - totalProcessingCost;

  // 6. Total Recaptured = (Eliminated Disposal Cost Liability) + Net Gain
  const totalValueRecaptured = currentWasteLiability + netEconomicYield;

  return {
    currentWasteLiability,
    totalProcessingCost,
    finishedProductMassKg,
    expectedGrossRevenue,
    netEconomicYield,
    totalValueRecaptured,
    disclaimer: "Illustrative Calculation — Demo Data Only",
  };
}
