import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { impactEngine } from "@/lib/services/impactEngine";
import { impactService } from "@/lib/services/impactService";
import { handleApiError } from "@/lib/security/errors";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wasteDivertedKg, wasteType, batchId } = body;

    const result = impactEngine.calculate({
      wasteDivertedKg: Number(wasteDivertedKg),
      wasteType,
    });

    const user = await getCurrentUser();
    let impactRecord = null;

    if (user?.organizationId) {
      impactRecord = await impactService.log({
        organizationId: user.organizationId,
        batchId: batchId || undefined,
        wasteDiverted: result.wasteDivertedKg,
        materialRecovered: result.materialRecoveredKg,
        estimatedCo2Reduction: result.estimatedCo2ReductionKg,
        productsProduced: result.productsProducedUnits,
        methodology: "Comparative Life Cycle Analysis vs Landfill Linear Baseline",
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        recordId: impactRecord?.id,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
