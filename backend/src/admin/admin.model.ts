import mongoose, { Schema } from "mongoose";
import { IAdmin } from "./admin.interface";

const AdminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  hospitalId: { type: mongoose.Types.ObjectId, ref: "Hospital", required: true },
  role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
  isActive: { type: Boolean, default: true },
  
},{timestamps:true});

export const AdminModel = mongoose.model<IAdmin>("Admin", AdminSchema);