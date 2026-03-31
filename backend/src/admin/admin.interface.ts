import { Document, Types } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  mobileNumber: string; // added mobile number
  hospitalId: Types.ObjectId; // reference to hospital
  role: "admin" | "superadmin"; // role
  isActive: boolean;
  createdAt: Date;
}