import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/passwords";
import { setSessionCookie } from "@/lib/auth/session";
import { RegisterSchema } from "@/lib/validation/auth.schema";
import { sanitizeString } from "@/lib/security/sanitize";
import { handleApiError, AppError } from "@/lib/security/errors";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = RegisterSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError("An account with this email address already exists.", 409, "CONFLICT");
    }

    const passwordHash = await hashPassword(validated.password);

    // Create organization & user transaction
    const result = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: sanitizeString(validated.organizationName),
          industryType: validated.role === "FACTORY" ? "Industrial Manufacturing" : validated.role === "PROCESSOR" ? "Recycling & Processing" : "Ecosystem Authority",
          location: sanitizeString(validated.location),
          verificationStatus: validated.role !== "ADMIN" ? "VERIFIED" : "UNVERIFIED",
        },
      });

      const user = await tx.user.create({
        data: {
          name: sanitizeString(validated.name),
          email: validated.email.toLowerCase(),
          passwordHash,
          role: validated.role,
          organizationId: org.id,
        },
      });

      return { user, org };
    });

    await setSessionCookie({
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role as any,
      organizationId: result.org.id,
      organizationName: result.org.name,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        organizationName: result.org.name,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
