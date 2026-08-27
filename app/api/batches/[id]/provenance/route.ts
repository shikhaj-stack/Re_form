import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { requireAuth } from "@/lib/auth/rbac";
import { provenanceService } from "@/lib/services/provenanceService";
import { handleApiError, AppError } from "@/lib/security/errors";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const provenance = await provenanceService.getProvenanceHistory(params.id);

    // Verify organization-level authorization
    if (user.role !== "ADMIN") {
      const isSourceOrg = provenance.batch.sourceOrganization?.id === user.organizationId;
      const isProcOrg = provenance.batch.processingUnit?.id === user.organizationId;

      if (!isSourceOrg && !isProcOrg) {
        throw new AppError("Forbidden: You do not have permission to view this batch's provenance record.", 403, "FORBIDDEN");
      }
    }

    return NextResponse.json({
      success: true,
      data: provenance,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
