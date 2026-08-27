import { z } from "zod";

export const BatchStatuses = [
  "GENERATED",
  "COLLECTED",
  "PROCESSED",
  "CONVERTED",
  "TESTED",
  "DISPATCHED",
] as const;

export const CreateBatchSchema = z.object({
  wasteStreamId: z.string().min(1, "Waste stream ID is required"),
  quantityKg: z.coerce.number().positive("Quantity must be greater than zero"),
  targetProduct: z.string().min(2, "Target product is required"),
  processorOrgId: z.string().optional(),
});

export const UpdateBatchStatusSchema = z.object({
  batchId: z.string().min(1, "Batch ID is required"),
  status: z.enum(BatchStatuses),
  notes: z.string().max(500).optional(),
});

export type CreateBatchInput = z.infer<typeof CreateBatchSchema>;
export type UpdateBatchStatusInput = z.infer<typeof UpdateBatchStatusSchema>;
