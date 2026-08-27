import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { economicEngine } from "@/lib/services/economicEngine";
import { calculationService } from "@/lib/services/calculationService";
import { handleApiError, AppError } from "@/lib/security/errors";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      wasteQuantity,
      currentDisposalCost,
      processingCost,
      expectedProductOutput,
      productSellingPrice,
      wasteStreamId,
      batchId,
    } = body;

    // Validate inputs with economicEngine
    const result = economicEngine.calculate({
      wasteQuantity: Number(wasteQuantity),
      currentDisposalCost: Number(currentDisposalCost),
      processingCost: Number(processingCost),
      expectedProductOutput: Number(expectedProductOutput),
      productSellingPrice: Number(productSellingPrice),
    });

    const user = await getCurrentUser();
    let calculationRecord = null;

    if (user?.organizationId) {
      calculationRecord = await calculationService.log({
        organizationId: user.organizationId,
        wasteStreamId: wasteStreamId || undefined,
        batchId: batchId || undefined,
        wasteQuantity: Number(wasteQuantity),
        disposalCost: result.currentWasteCost,
        processingCost: result.processingCostTotal,
        expectedProductOutput: Number(expectedProductOutput),
        sellingPrice: Number(productSellingPrice),
        estimatedRevenue: result.potentialProductRevenue,
        estimatedNetValue: result.estimatedNetValue,
        estimatedValueRecovered: result.potentialValueRecovered,
        assumptions: {
          wasteQuantity,
          currentDisposalCost,
          processingCost,
          expectedProductOutput,
          productSellingPrice,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        recordId: calculationRecord?.id,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
