import { NextResponse } from "next/server";
import { clearSessionCookie, getCurrentUser } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/security/audit";

export async function POST() {
  const user = await getCurrentUser();
  if (user) {
    await logAuditEvent({
      actorId: user.id,
      organizationId: user.organizationId,
      action: "LOGOUT",
      resourceType: "Session",
      resourceId: user.id,
    });
  }

  await clearSessionCookie();
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
