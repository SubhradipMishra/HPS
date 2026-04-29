import { Types } from "mongoose";

export interface IDoctor {
  name: string;
  email: string;
  mobileNumber: string;
  specialization: string;
  experience: number;

  hospitalId: Types.ObjectId;
  departmentId: Types.ObjectId;
  createdBy: Types.ObjectId;

  password?: string;
  role?: string;

  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}