import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { requireAuth, assertOwnership } from "@/lib/auth/rbac";
import { wasteStreamService } from "@/lib/services/wasteStreamService";
import { recommendationEngine } from "@/lib/services/recommendationEngine";
import { assessmentService } from "@/lib/services/assessmentService";
import { pathwayService } from "@/lib/services/pathwayService";
import { auditService } from "@/lib/services/auditService";
import { handleApiError } from "@/lib/security/errors";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const stream = await wasteStreamService.getById(params.id);

    assertOwnership(user, stream.organizationId);

    // Call clearly separated rule-based recommendationEngine
    const assessment = recommendationEngine.assessWaste({
      wasteType: stream.wasteType,
      quantity: stream.quantity,
      unit: stream.unit,
      contaminationLevel: stream.contaminationLevel,
      generationFrequency: stream.generationFrequency,
    });

    const pathway = await pathwayService.findByInput(stream.wasteType);

    const savedAssessment = await assessmentService.create({
      wasteStreamId: stream.id,
      recoverabilityEstimate: assessment.estimatedRecoverability,
      recommendedPathwayId: pathway?.id,
      potentialProduct: assessment.potentialProduct,
      confidenceLevel: "PROTOTYPE_CONFIDENCE",
      disclaimer: assessment.disclaimer,
    });

    await auditService.log({
      actorId: user.id,
      organizationId: user.organizationId,
      action: "ASSESSMENT_SUBMITTED",
      resourceType: "Assessment",
      resourceId: savedAssessment.id,
      metadata: { wasteType: stream.wasteType, recoverability: assessment.estimatedRecoverability },
    });

    return NextResponse.json({
      success: true,
      data: {
        assessmentId: savedAssessment.id,
        material: assessment.material,
        estimatedRecoverability: assessment.estimatedRecoverability,
        recoverabilityPercent: assessment.recoverabilityPercent,
        recommendedPathway: assessment.recommendedPathway,
        potentialProduct: assessment.potentialProduct,
        expectedPaverUnits: assessment.expectedPaverUnits,
        estimatedGrossValue: assessment.estimatedGrossValue,
        estimatedCo2OffsetKg: assessment.estimatedCo2OffsetKg,
        disclaimer: assessment.disclaimer,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
