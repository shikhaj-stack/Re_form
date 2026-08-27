import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { requireAuth } from "@/lib/auth/rbac";
import { wasteStreamService } from "@/lib/services/wasteStreamService";
import { auditService } from "@/lib/services/auditService";
import { WasteIntakeSchema } from "@/lib/validation/waste.schema";
import { handleApiError, AppError } from "@/lib/security/errors";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await req.json();
    const validated = WasteIntakeSchema.parse(body);

    const stream = await wasteStreamService.create({
      organizationId: user.organizationId,
      wasteType: validated.wasteType.toUpperCase().replace(/\s+/g, "_"),
      quantity: validated.quantityMonthly,
      unit: "KG",
      generationFrequency: validated.frequency.toUpperCase().replace(/\s+/g, "_"),
      contaminationLevel: validated.contamination.toUpperCase().replace(/\s+/g, "_"),
      currentDisposalMethod: validated.disposalMethod,
      location: validated.location,
    });

    await auditService.log({
      actorId: user.id,
      organizationId: user.organizationId,
      action: "CREATE_WASTE_STREAM",
      resourceType: "WasteStream",
      resourceId: stream.id,
      metadata: { wasteType: stream.wasteType, quantity: stream.quantity },
    });

    return NextResponse.json({ success: true, data: stream }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    // Return only authorized streams (Admin sees all, user sees own organization's streams)
    const streams = await wasteStreamService.listByOrganization(
      user?.role === "ADMIN" ? undefined : user?.organizationId
    );

    return NextResponse.json({ success: true, data: streams });
  } catch (error) {
    return handleApiError(error);
  }
}
