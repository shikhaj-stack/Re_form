import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { WasteIntakeSchema } from "@/lib/validation/waste.schema";
import { wasteStreamService } from "@/lib/services/wasteStreamService";
import { assessmentService } from "@/lib/services/assessmentService";
import { pathwayService } from "@/lib/services/pathwayService";
import { auditService } from "@/lib/services/auditService";
import { calculatePaverConversion } from "@/lib/calculations/paver-conversion";
import { handleApiError } from "@/lib/security/errors";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const validated = WasteIntakeSchema.parse(body);

    let recoverability = 0.82;
    let pathwayName = "Foundry Sand + Suitable Plastic -> Recycled Construction Pavers";
    let targetProduct = "Recycled Construction Pavers";
    let grossVal = 382500;
    let co2Offset = 3444;

    if (validated.wasteType === "Foundry Sand") {
      const conv = calculatePaverConversion(validated.quantityMonthly);
      recoverability = conv.recoveredRatio;
      targetProduct = "Recycled Construction Pavers";
      grossVal = conv.producedPaverUnits * 45;
      co2Offset = conv.co2OffsetKg;
    } else if (validated.wasteType === "Plastic Scrap") {
      recoverability = 0.88;
      pathwayName = "Plastic Scrap -> Composite Structural Lumber";
      targetProduct = "Composite Structural Lumber";
      grossVal = validated.quantityMonthly * 135;
      co2Offset = validated.quantityMonthly * 2.1;
    } else if (validated.wasteType === "Textile Waste") {
      recoverability = 0.75;
      pathwayName = "Textile Waste -> Acoustic Insulation Panels";
      targetProduct = "High-Density Acoustic Insulation Panels";
      grossVal = validated.quantityMonthly * 95;
      co2Offset = validated.quantityMonthly * 1.4;
    } else if (validated.wasteType === "Glass Waste") {
      recoverability = 0.95;
      pathwayName = "Glass Waste -> Fine Construction Aggregate Sand Substitute";
      targetProduct = "Engineered Concrete Aggregate";
      grossVal = validated.quantityMonthly * 18;
      co2Offset = validated.quantityMonthly * 0.3;
    } else if (validated.wasteType === "Fly Ash") {
      recoverability = 0.90;
      pathwayName = "Fly Ash -> Geopolymer Building Materials & Green Cement";
      targetProduct = "Low-Carbon Green Cement";
      grossVal = validated.quantityMonthly * 22;
      co2Offset = validated.quantityMonthly * 0.8;
    } else {
      recoverability = 0.85;
      pathwayName = "Metal Scrap -> High-Purity Secondary Raw Alloys";
      targetProduct = "High-Purity Alloy Billets";
      grossVal = validated.quantityMonthly * 180;
      co2Offset = validated.quantityMonthly * 3.5;
    }

    let savedStream = null;
    let savedAssessment = null;

    if (user?.organizationId) {
      savedStream = await wasteStreamService.create({
        organizationId: user.organizationId,
        wasteType: validated.wasteType.toUpperCase().replace(/\s+/g, "_"),
        quantity: validated.quantityMonthly,
        unit: "KG",
        generationFrequency: validated.frequency.toUpperCase().replace(/\s+/g, "_"),
        contaminationLevel: validated.contamination.toUpperCase().replace(/\s+/g, "_"),
        currentDisposalMethod: validated.disposalMethod,
        location: validated.location,
      });

      const pathway = await pathwayService.findByInput(
        validated.wasteType.toUpperCase().replace(/\s+/g, "_")
      );

      savedAssessment = await assessmentService.create({
        wasteStreamId: savedStream.id,
        recoverabilityEstimate: recoverability,
        recommendedPathwayId: pathway?.id,
        potentialProduct: targetProduct,
        confidenceLevel: "PROTOTYPE_CONFIDENCE",
        disclaimer: "Prototype Estimate — Requires Material Testing",
      });

      await auditService.log({
        actorId: user.id,
        organizationId: user.organizationId,
        action: "ASSESSMENT_SUBMITTED",
        resourceType: "Assessment",
        resourceId: savedAssessment.id,
        metadata: { wasteType: validated.wasteType, quantity: validated.quantityMonthly },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        streamId: savedStream?.id,
        assessmentId: savedAssessment?.id,
        wasteType: validated.wasteType,
        quantityMonthly: validated.quantityMonthly,
        location: validated.location,
        recoverabilityRatio: recoverability,
        recoverabilityPercent: Math.round(recoverability * 100),
        recommendedPathway: pathwayName,
        targetProduct,
        estGrossValue: grossVal,
        estCo2OffsetKg: co2Offset,
        disclaimer: "Prototype Estimate — Requires Material Testing",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const assessments = await assessmentService.listRecent(
      user?.role === "ADMIN" ? undefined : user?.organizationId
    );

    return NextResponse.json({ success: true, data: assessments || [] });
  } catch (error) {
    return NextResponse.json({ success: true, data: [] });
  }
}
