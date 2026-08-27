import { NextRequest, NextResponse } from "next/server";
import { pathwayService } from "@/lib/services/pathwayService";
import { handleApiError } from "@/lib/security/errors";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(req: NextRequest) {
  try {
    const pathways = await pathwayService.listActive();

    return NextResponse.json({
      success: true,
      data: (pathways || []).map((p) => ({
        id: p.id,
        name: p.name,
        inputMaterial: p.inputMaterial,
        secondaryMaterial: p.secondaryMaterial,
        outputProduct: p.outputProduct,
        processingStages: p.processingStages,
        potentialMarket: p.potentialMarket,
        estimatedValueMin: p.estimatedValueMin,
        estimatedValueMax: p.estimatedValueMax,
        environmentalBenefitDescription: p.environmentalBenefitDescription,
        validationStatus: p.validationStatus,
        disclaimer: "Prototype Demonstration Pathway — Requires Material Testing",
      })),
    });
  } catch (error) {
    return NextResponse.json({ success: true, data: [] });
  }
}
