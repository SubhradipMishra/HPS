// src/patient/PatientModel.ts
import mongoose, { Schema } from "mongoose";
import { IPatient } from "./patient.interface";

const PatientSchema: Schema<IPatient> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true }, // optional, unique if provided
    mobileNumber: { type: String, required: true },
    password: { type: String }, // only if patient signs up themselves
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    createdBy: { type: String, enum: ["self", "receptionist"], required: true },
    isActive: { type: Boolean, default: true },
    reports: [
      {
        fileName: { type: String, required: true },
        category: { type: String, required: true },
        uploadDate: { type: Date, default: Date.now },
      },
    ],
  },

  { timestamps: { createdAt: true, updatedAt: true } }
);

export const PatientModel = mongoose.model<IPatient>("Patient", PatientSchema);