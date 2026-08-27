import { z } from "zod";

export const WasteTypes = [
  "Foundry Sand",
  "Plastic Scrap",
  "Textile Waste",
  "Glass Waste",
  "Fly Ash",
  "Metal Scrap",
] as const;

export const Frequencies = [
  "Batch",
  "Continuous",
  "Weekly",
  "Monthly",
] as const;

export const Contaminations = [
  "Low",
  "Moderate",
  "High",
  "Highly Complex",
] as const;

export const DisposalMethods = [
  "Landfill Storage",
  "Incineration",
  "Outsourced Hauling",
] as const;

export const WasteIntakeSchema = z.object({
  wasteType: z.enum(WasteTypes, {
    errorMap: () => ({ message: "Select a recognized industrial byproduct type" }),
  }),
  quantityMonthly: z.coerce
    .number()
    .positive("Quantity must be greater than zero")
    .max(10000000, "Quantity exceeds prototype processing volume limit (10M kg)"),
  unit: z.literal("kg/month").default("kg/month"),
  location: z
    .string()
    .min(2, "Location is required")
    .max(120, "Location name too long"),
  frequency: z.enum(Frequencies),
  contamination: z.enum(Contaminations),
  disposalMethod: z.enum(DisposalMethods),
});

export type WasteIntakeInput = z.infer<typeof WasteIntakeSchema>;
