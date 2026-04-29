import { Request, Response } from "express";
import DoctorAvailabilityModel from "./doctoravailability.model";

// CREATE doctor availability
export const createDoctorAvailability = async (req: Request, res: Response) => {
    try {
        const {
            doctorId,
            hospitalId,
            departmentId,
            dayOfWeek,
            startTime,
            endTime,
            slotDuration,
        } = req.body;

        // basic validation
        if (
            !doctorId ||
            !hospitalId ||
            !departmentId ||
            !dayOfWeek ||
            !startTime ||
            !endTime ||
            !slotDuration
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // prevent duplicate availability for same doctor + same day
        const existing = await DoctorAvailabilityModel.findOne({
            doctorId,
            hospitalId,
            dayOfWeek,
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Availability already exists for this day",
            });
        }

        const availability = await DoctorAvailabilityModel.create({
            doctorId,
            hospitalId,
            departmentId,
            dayOfWeek,
            startTime,
            endTime,
            slotDuration,
        });

        return res.status(201).json({
            success: true,
            message: "Doctor availability created successfully",
            data: availability,
        });
    } catch (error: any) {
        console.log("Error creating doctor availability:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};