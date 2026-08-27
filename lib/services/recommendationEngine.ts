/**
 * RE-FORM Recommendation Engine
 * 
 * Rule-based material analysis service for prototype assessment.
 * Note: Clearly isolated deterministic logic. Not represented as an AI model.
 */

export interface WasteAssessmentInput {
  wasteType: string;
  quantity: number;
  unit?: string;
  contaminationLevel?: string;
  generationFrequency?: string;
}

export interface RecommendationResult {
  material: string;
  estimatedRecoverability: number;
  recoverabilityPercent: number;
  recommendedPathway: string;
  potentialProduct: string;
  expectedPaverUnits?: number;
  estimatedGrossValue: number;
  estimatedCo2OffsetKg: number;
  disclaimer: string;
}

export const recommendationEngine = {
  assessWaste(input: WasteAssessmentInput): RecommendationResult {
    const rawType = input.wasteType.toUpperCase().replace(/\s+/g, "_");
    const quantity = Number(input.quantity) || 0;

    const baseDisclaimer =
      "Prototype estimate only. Conversion recommendations require laboratory validation, engineering assessment, and regulatory compliance before commercial deployment.";

    switch (rawType) {
      case "FOUNDRY_SAND": {
        // Foundry Sand + 25% Waste Polymer Binder -> Construction Pavers
        const recoveryRatio = 0.82; // 82% effective yield
        const requiredPolymerKg = quantity * (25 / 75);
        const totalCompositeMassKg = (quantity + requiredPolymerKg) * recoveryRatio;
        const avgPaverWeightKg = 3.5;
        const paverCount = Math.floor(totalCompositeMassKg / avgPaverWeightKg);
        const grossValue = paverCount * 45; // ~₹45 per paver block
        const co2AvoidanceKg = Math.round(totalCompositeMassKg * 0.42);

        return {
          material: "Foundry Silica Sand",
          estimatedRecoverability: recoveryRatio,
          recoverabilityPercent: 82,
          recommendedPathway:
            "Foundry Sand + Suitable Waste Plastic → Recycled Construction Pavers",
          potentialProduct: "IS 15658 Interlocking Concrete Paver Blocks",
          expectedPaverUnits: paverCount,
          estimatedGrossValue: grossValue,
          estimatedCo2OffsetKg: co2AvoidanceKg,
          disclaimer: baseDisclaimer,
        };
      }

      case "PET_PLASTIC":
      case "PLASTIC_SCRAP":
      case "MIXED_PLASTIC": {
        const recoveryRatio = 0.88;
        const netMass = quantity * recoveryRatio;
        return {
          material: "Industrial Polymer Scrap",
          estimatedRecoverability: recoveryRatio,
          recoverabilityPercent: 88,
          recommendedPathway: "Plastic Scrap → Composite Structural Lumber",
          potentialProduct: "Composite Structural Lumber & Paving Beams",
          estimatedGrossValue: Math.round(netMass * 135),
          estimatedCo2OffsetKg: Math.round(netMass * 2.1),
          disclaimer: baseDisclaimer,
        };
      }

      case "TEXTILE_WASTE": {
        const recoveryRatio = 0.75;
        const netMass = quantity * recoveryRatio;
        return {
          material: "Industrial Textile Waste",
          estimatedRecoverability: recoveryRatio,
          recoverabilityPercent: 75,
          recommendedPathway: "Textile Waste → Acoustic Insulation Panels",
          potentialProduct: "High-Density Acoustic Insulation Panels",
          estimatedGrossValue: Math.round(netMass * 95),
          estimatedCo2OffsetKg: Math.round(netMass * 1.4),
          disclaimer: baseDisclaimer,
        };
      }

      case "GLASS_WASTE": {
        const recoveryRatio = 0.95;
        const netMass = quantity * recoveryRatio;
        return {
          material: "Industrial Glass Cullet",
          estimatedRecoverability: recoveryRatio,
          recoverabilityPercent: 95,
          recommendedPathway:
            "Glass Waste → Fine Construction Aggregate Sand Substitute",
          potentialProduct: "Engineered Concrete Aggregate",
          estimatedGrossValue: Math.round(netMass * 18),
          estimatedCo2OffsetKg: Math.round(netMass * 0.3),
          disclaimer: baseDisclaimer,
        };
      }

      case "FLY_ASH": {
        const recoveryRatio = 0.90;
        const netMass = quantity * recoveryRatio;
        return {
          material: "Class F Coal Fly Ash",
          estimatedRecoverability: recoveryRatio,
          recoverabilityPercent: 90,
          recommendedPathway:
            "Fly Ash → Geopolymer Building Materials & Green Cement",
          potentialProduct: "Zero-Clinker Low-Carbon Green Cement",
          estimatedGrossValue: Math.round(netMass * 22),
          estimatedCo2OffsetKg: Math.round(netMass * 0.8),
          disclaimer: baseDisclaimer,
        };
      }

      default: {
        const recoveryRatio = 0.85;
        const netMass = quantity * recoveryRatio;
        return {
          material: input.wasteType,
          estimatedRecoverability: recoveryRatio,
          recoverabilityPercent: 85,
          recommendedPathway: "Metal Scrap → High-Purity Secondary Raw Alloys",
          potentialProduct: "Secondary Foundry Raw Materials",
          estimatedGrossValue: Math.round(netMass * 180),
          estimatedCo2OffsetKg: Math.round(netMass * 3.5),
          disclaimer: baseDisclaimer,
        };
      }
    }
  },
};
