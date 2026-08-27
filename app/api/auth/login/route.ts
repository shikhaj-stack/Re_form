import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/passwords";
import { setSessionCookie } from "@/lib/auth/session";
import { LoginSchema } from "@/lib/validation/auth.schema";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { logAuditEvent } from "@/lib/security/audit";
import { handleApiError, AppError } from "@/lib/security/errors";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // Strict Rate Limiting on Authentication: 5 attempts per minute
    const rateCheck = checkRateLimit(`login_${ip}`, {
      windowMs: 60000,
      maxRequests: 10,
    });

    if (!rateCheck.allowed) {
      throw new AppError(
        "Too many authentication attempts. Please try again after 60 seconds.",
        429,
        "RATE_LIMIT_EXCEEDED"
      );
    }

    const body = await req.json();
    const validated = LoginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
      include: { organization: true },
    });

    if (!user) {
      // Return generic authentication error
      throw new AppError("Invalid email or password provided.", 401, "INVALID_CREDENTIALS");
    }

    const isMatch = await verifyPassword(validated.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError("Invalid email or password provided.", 401, "INVALID_CREDENTIALS");
    }

    // Set secure HTTP-only cookie session
    await setSessionCookie({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      organizationId: user.organizationId,
      organizationName: user.organization.name,
    });

    // Audit login
    await logAuditEvent({
      actorId: user.id,
      organizationId: user.organizationId,
      action: "LOGIN",
      resourceType: "Session",
      resourceId: user.id,
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationName: user.organization.name,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
