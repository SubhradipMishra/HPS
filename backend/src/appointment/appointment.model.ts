import { Schema, model } from "mongoose";
import IAppointment from "./appointment.interface";

const appointmentSchema = new Schema<IAppointment>(
    {
        patientId: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },

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

        date: {
            type: String,
            required: true,
        },

        slotTime: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["booked", "cancelled", "completed"],
            default: "booked",
        },
        remarks: {
            type: String,
        },
        prescriptionFile: {
            type: String,
        },
        patientReport: {
            type: String,
        },
        patientReportCategory: {
            type: String,
            enum: ["Lab Report", "Prescription", "Other"],
        },
        review: {
            type: String,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
    },
    { timestamps: true }
);



/*
  Prevent double booking ONLY when status = "booked"
  If appointment is cancelled → slot becomes free again
*/
appointmentSchema.index(
    { doctorId: 1, hospitalId: 1, date: 1, slotTime: 1 },
    {
        unique: true,
        partialFilterExpression: { status: "booked" },
    }
);

const AppointmentModel = model<IAppointment>("Appointment", appointmentSchema);

export default AppointmentModel;