import { AppError } from "@/lib/security/errors";

export type BatchEventType =
  | "GENERATED"
  | "COLLECTED"
  | "SORTED"
  | "CLEANED"
  | "PROCESSED"
  | "CONVERTED"
  | "TESTED"
  | "SOLD";

/**
 * Ordered Finite State Pipeline Policy
 */
export const ORDERED_TRANSITIONS: Record<BatchEventType, BatchEventType[]> = {
  GENERATED: ["COLLECTED"],
  COLLECTED: ["SORTED"],
  SORTED: ["CLEANED"],
  CLEANED: ["PROCESSED"],
  PROCESSED: ["CONVERTED"],
  CONVERTED: ["TESTED"],
  TESTED: ["SOLD"],
  SOLD: [], // Terminal status
};

export const transitionPolicy = {
  /**
   * Validates state transition adherence.
   * Prevents backward mutations (e.g. SOLD -> GENERATED) and skipping essential checkpoints.
   */
  validateTransition(
    currentStatus: string,
    targetStatus: string,
    isAdmin = false
  ): { valid: boolean; reason?: string } {
    if (currentStatus === targetStatus) {
      return {
        valid: false,
        reason: `Batch is already in state '${currentStatus}'. Duplicate event disallowed.`,
      };
    }

    const curr = currentStatus.toUpperCase() as BatchEventType;
    const target = targetStatus.toUpperCase() as BatchEventType;

    const allowedNext = ORDERED_TRANSITIONS[curr];

    if (!allowedNext) {
      return {
        valid: false,
        reason: `Current state '${currentStatus}' is invalid or unknown.`,
      };
    }

    if (allowedNext.includes(target)) {
      return { valid: true };
    }

    // Admins can override, but must be logged explicitly
    if (isAdmin) {
      return { valid: true, reason: "ADMIN_OVERRIDE_APPLIED" };
    }

    return {
      valid: false,
      reason: `Invalid transition from '${currentStatus}' to '${targetStatus}'. Allowed next transition: ${allowedNext.join(", ") || "None (Terminal state reached)"}.`,
    };
  },

  assertTransition(currentStatus: string, targetStatus: string, isAdmin = false) {
    const result = this.validateTransition(currentStatus, targetStatus, isAdmin);
    if (!result.valid) {
      throw new AppError(result.reason || "Invalid status transition", 400, "INVALID_TRANSITION");
    }
  },
};
