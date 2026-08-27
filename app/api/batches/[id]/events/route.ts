import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/rbac";
import { provenanceService } from "@/lib/services/provenanceService";
import { auditService } from "@/lib/services/auditService";
import { BatchEventType } from "@/lib/services/transitionPolicy";
import { handleApiError, AppError } from "@/lib/security/errors";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    const body = await req.json();
    const { eventType, title, description, metadata } = body;

    if (!eventType) {
      throw new AppError(
        "eventType is required (e.g. COLLECTED, SORTED, CLEANED, PROCESSED, CONVERTED, TESTED, SOLD).",
        400
      );
    }

    const { event, currentHash } = await provenanceService.appendEvent({
      batchId: params.id,
      eventType: eventType as BatchEventType,
      title: title || `Milestone ${eventType} Recorded`,
      description: description || `Checkpoint verified by ${user.name}`,
      metadata,
      actor: user,
    });

    await auditService.log({
      actorId: user.id,
      organizationId: user.organizationId,
      action: "UPDATE_BATCH_STATUS",
      resourceType: "Batch",
      resourceId: params.id,
      metadata: { eventType, sha256Hash: currentHash },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          event,
          sha256Hash: currentHash,
          batchId: params.id,
          status: eventType,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
