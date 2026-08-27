import { User, Organization } from "@prisma/client";

/**
 * Safe Serialization Utilities
 * Ensures internal credentials, password hashes, and sensitive flags are stripped
 * before emitting model payloads across API boundaries.
 */

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  organization?: Partial<Organization>;
}

export function sanitizeUser(user: User & { organization?: Partial<Organization> }): SafeUser {
  const { passwordHash, ...safe } = user;
  return safe;
}

export function sanitizeUsers(users: (User & { organization?: Partial<Organization> })[]): SafeUser[] {
  return users.map(sanitizeUser);
}
