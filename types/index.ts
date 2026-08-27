export type Role = "FACTORY" | "PROCESSOR" | "ADMIN";

export type WasteType =
  | "Foundry Sand"
  | "Plastic Scrap"
  | "Textile Waste"
  | "Glass Waste"
  | "Fly Ash"
  | "Metal Scrap";

export type BatchStatus =
  | "GENERATED"
  | "COLLECTED"
  | "PROCESSED"
  | "CONVERTED"
  | "TESTED"
  | "DISPATCHED";

export type ContaminationIndex = "Low" | "Moderate" | "High" | "Highly Complex";

export type DisposalMethod =
  | "Landfill Storage"
  | "Incineration"
  | "Outsourced Hauling";

export type DisclaimerTag =
  | "DEMO_DATA"
  | "PROTOTYPE_ESTIMATE"
  | "ILLUSTRATIVE_CALCULATION"
  | "REQUIRES_LABORATORY_VALIDATION"
  | "REQUIRES_REGULATORY_COMPLIANCE";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  organizationId: string;
  organizationName: string;
}

export interface MetricOutput {
  value: number | string;
  unit?: string;
  prefix?: string;
  label: string;
  change?: string;
  disclaimer: DisclaimerTag;
}
