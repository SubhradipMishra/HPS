import mongoose, { Schema, model } from "mongoose";
import { IDepartment } from "./department.interface";

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    code: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate department names inside the same hospital
DepartmentSchema.index({ name: 1, hospitalId: 1 }, { unique: true });

const DepartmentModel = model<IDepartment>("Department", DepartmentSchema);

export default DepartmentModel;