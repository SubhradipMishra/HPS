// src/patient/IPatient.ts
import { Document } from "mongoose";

export interface IPatient extends Document {
  name: string;
  email?: string;
  mobileNumber: string;
  password?: string;
  dob?: Date;
  gender?: "male" | "female" | "other";
  createdBy: "self" | "receptionist";
  isActive: boolean;
  createdAt: Date;
}