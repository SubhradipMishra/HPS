import { Schema, model } from "mongoose";
import IDoctorAvailability from "./doctoravailability.interface";

const doctorAvailabilitySchema = new Schema<IDoctorAvailability>(
    {
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },

        hospitalId: {
            type: Schema.Types.ObjectId,
            ref: "Hospital",
            required: true,
        },

        departmentId: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },

        dayOfWeek: {
            type: String,
            required: true,
            enum: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
        },

        startTime: {
            type: String, // example: 10:00
            required: true,
        },

        endTime: {
            type: String, // example: 13:00
            required: true,
        },

        slotDuration: {
            type: Number, // 15 / 20 / 30
            required: true,
        },
    },
    { timestamps: true }
);

const DoctorAvailabilityModel = model<IDoctorAvailability>(
    "DoctorAvailability",
    doctorAvailabilitySchema
);

export default DoctorAvailabilityModel;