import { model, Schema } from "mongoose";
import IHospital from "./hospital.interface";

const HospitalSchema = new Schema<IHospital>(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      lowercase: true,
    },

    city: {
      type: String,
      required: true,
      lowercase: true,
    },

    state: {
      type: String,
      required: true,
      lowercase: true,
    },

    regNo: {
      type: String,
      required: true,
      unique: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  { timestamps: true }
);

// very important for nearby search
HospitalSchema.index({ location: "2dsphere" });

const HospitalModel = model<IHospital>("Hospital", HospitalSchema);

export default HospitalModel;