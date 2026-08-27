import { Prisma } from "@prisma/client";
import { AppError } from "@/lib/security/errors";

/**
 * Translates low-level Prisma Client errors into sanitized, structured AppError instances.
 * Never leaks raw SQL or database connection details to clients.
 */
export function handleDatabaseError(error: unknown): AppError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        // Unique constraint violation
        const target = Array.isArray(error.meta?.target)
          ? (error.meta?.target as string[]).join(", ")
          : (error.meta?.target as string) || "resource";
        return new AppError(
          `A record with this ${target} already exists in the system.`,
          409,
          "DUPLICATE_ENTRY"
        );
      }
      case "P2025": {
        // Record not found
        return new AppError(
          "The requested database record was not found.",
          404,
          "RECORD_NOT_FOUND"
        );
      }
      case "P2003": {
        // Foreign key constraint failure
        return new AppError(
          "The operation violates relational constraints with an associated record.",
          400,
          "FOREIGN_KEY_VIOLATION"
        );
      }
      case "P2014": {
        // Required relation violation
        return new AppError(
          "The change would violate an essential relational dependency between records.",
          400,
          "RELATIONAL_VIOLATION"
        );
      }
      default:
        return new AppError(
          "A database operation constraint occurred.",
          400,
          `DB_ERROR_${error.code}`
        );
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new AppError(
      "Database schema validation failed for the provided parameters.",
      422,
      "DB_VALIDATION_ERROR"
    );
  }

  if (error instanceof AppError) {
    return error;
  }

  return new AppError(
    "An internal database error occurred.",
    500,
    "DATABASE_INTERNAL_ERROR"
  );
}
