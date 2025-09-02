import type { User } from "../auth/auth.types";

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string; // "09:00"
  close: string; // "18:00"
  closed: boolean;
}

export interface Company {
  id: string;
  name: string;
  taxId: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  displayName: string;
}

// Branch type options
export const BRANCH_TYPES = [
  { value: "retail", label: "Retail Store" },
  { value: "warehouse", label: "Warehouse" },
  { value: "office", label: "Office" },
  { value: "virtual", label: "Virtual" },
  { value: "distribution", label: "Distribution Center" },
] as const;
export type BranchTypeValue = (typeof BRANCH_TYPES)[number]["value"];

export interface Branch {
  id: string;
  name: string;
  code: string;
  type: BranchTypeValue;
  typeDisplayName: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  isMain: boolean;
  latitude?: number;
  longitude?: number;
  businessHours: BusinessHours;
  createdAt: string;
  updatedAt: string;
  displayName: string;
  isCurrentlyOpen: boolean;
  manager?: User;
  company: Company;
}

export interface BranchesResponse {
  branches: Branch[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateBranchRequest {
  name: string;
  code: string;
  type: BranchTypeValue;
  address: string;
  phone: string;
  email: string;
  managerId?: string;
  latitude?: number;
  longitude?: number;
  businessHours: BusinessHours;
  isActive: boolean;
  isMain: boolean;
}

export interface UpdateBranchRequest extends Partial<CreateBranchRequest> {
  id: string;
}

export interface BranchFilters {
  search?: string;
  type?: string;
  isActive?: boolean;
  managerId?: string;
}

// Default business hours template
export const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  monday: { open: "09:00", close: "18:00", closed: false },
  tuesday: { open: "09:00", close: "18:00", closed: false },
  wednesday: { open: "09:00", close: "18:00", closed: false },
  thursday: { open: "09:00", close: "18:00", closed: false },
  friday: { open: "09:00", close: "18:00", closed: false },
  saturday: { open: "10:00", close: "16:00", closed: false },
  sunday: { open: "00:00", close: "00:00", closed: true },
};
