import { Document, Types } from "mongoose";

interface IDoctorAvailability extends Document {
    doctorId: Types.ObjectId;
    hospitalId: Types.ObjectId;
    departmentId: Types.ObjectId;

    dayOfWeek: string; // Monday, Tuesday, Wednesday...

    startTime: string; // 10:00
    endTime: string;   // 13:00

    slotDuration: number; // in minutes (15 / 20 / 30)

    createdAt: Date;
    updatedAt: Date;
}

export default IDoctorAvailability;