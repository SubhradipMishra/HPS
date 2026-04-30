import { Document, Types } from "mongoose";

interface IAppointment extends Document {
    patientId: Types.ObjectId;
    doctorId: Types.ObjectId;
    hospitalId: Types.ObjectId;
    departmentId: Types.ObjectId;

    date: string;        // example: 2026-04-10
    slotTime: string;    // example: 10:40

    status: "booked" | "cancelled" | "completed";
    remarks?: string;
    prescriptionFile?: string;
    patientReport?: string;
    patientReportCategory?: "Lab Report" | "Prescription" | "Other";
    reportReview?: string;
    review?: string;
    rating?: number;


    createdAt: Date;
    updatedAt: Date;
}

export default IAppointment;