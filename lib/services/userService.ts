import { prisma } from "@/lib/db/prisma";
import { handleDatabaseError } from "@/lib/db/errors";
import { sanitizeUser, SafeUser } from "@/lib/db/serializers";
import { AppError } from "@/lib/security/errors";

export const userService = {
  async getByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { organization: true },
      });
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },

  async getSafeUserById(id: string): Promise<SafeUser> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: { organization: true },
      });
      if (!user) throw new AppError("User not found", 404, "NOT_FOUND");
      return sanitizeUser(user);
    } catch (e) {
      throw handleDatabaseError(e);
    }
  },
};
