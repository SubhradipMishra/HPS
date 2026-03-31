import { Types } from "mongoose";

export interface IDepartment {
  name: string;
  hospitalId: Types.ObjectId;
  description?: string;
  code?: string;
  createdBy: Types.ObjectId;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}