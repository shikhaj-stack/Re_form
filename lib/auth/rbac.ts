import { SessionUser, Role } from "@/types";
import { getCurrentUser } from "./session";
import { AppError } from "@/lib/security/errors";

export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AppError("Authentication required to access this resource", 401, "UNAUTHORIZED");
  }
  return user;
}

export async function requireRole(allowedRoles: Role[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new AppError(
      `Access forbidden. Role '${user.role}' is not authorized.`,
      403,
      "FORBIDDEN"
    );
  }
  return user;
}

export function verifyOwnership(user: SessionUser, resourceOrgId: string): boolean {
  if (user.role === "ADMIN") return true;
  return user.organizationId === resourceOrgId;
}

export function assertOwnership(user: SessionUser, resourceOrgId: string) {
  if (!verifyOwnership(user, resourceOrgId)) {
    throw new AppError("You do not have permission to access or modify this resource", 403, "OWNERSHIP_MISMATCH");
  }
}
