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

    createdAt: Date;
    updatedAt: Date;
}

export default IAppointment;