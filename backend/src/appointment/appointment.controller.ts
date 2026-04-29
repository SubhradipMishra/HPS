import { Request, Response } from "express";
import DoctorAvailabilityModel from "../doctoravailability/doctoravailability.model";
import AppointmentModel from "./appointment.model";
import { generateSlots } from "../utils/slotGenerator";


/* =========================================================
   GET AVAILABLE SLOTS
   ========================================================= */

export const getAvailableSlots = async (req: Request, res: Response) => {
    try {
        const { doctorId, hospitalId, date } = req.query;

        if (!doctorId || !hospitalId || !date) {
            return res.status(400).json({
                success: false,
                message: "doctorId, hospitalId and date are required",
            });
        }

        // Convert date → day name
        const dayOfWeek = new Date(date as string).toLocaleDateString("en-US", {
            weekday: "long",
        });

        // Find doctor availability
        const availability = await DoctorAvailabilityModel.findOne({
            doctorId,
            hospitalId,
            dayOfWeek,
        });

        if (!availability) {
            return res.status(404).json({
                success: false,
                message: "Doctor not available in this hospital on this date",
            });
        }

        // Generate all slots
        const slots = generateSlots(
            availability.startTime,
            availability.endTime,
            availability.slotDuration
        );

        // Find booked slots only (active bookings)
        const bookedSlots = await AppointmentModel.find({
            doctorId,
            hospitalId,
            date,
            status: "booked",
        }).select("slotTime");

        const booked = bookedSlots.map((s) => s.slotTime);

        // Remove booked slots
        const availableSlots = slots.filter((slot) => !booked.includes(slot));

        return res.status(200).json({
            success: true,
            doctorId,
            hospitalId,
            date,
            availableSlots,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};



/* =========================================================
   BOOK APPOINTMENT
   ========================================================= */

export const bookAppointment = async (req: Request, res: Response) => {
    try {
        const {
            patientId,
            doctorId,
            hospitalId,
            departmentId,
            date,
            slotTime,
        } = req.body;

        // Validate fields
        if (
            !patientId ||
            !doctorId ||
            !hospitalId ||
            !departmentId ||
            !date ||
            !slotTime
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Convert date → day name
        const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
        });

        // Check doctor availability
        const availability = await DoctorAvailabilityModel.findOne({
            doctorId,
            hospitalId,
            dayOfWeek,
        });

        if (!availability) {
            return res.status(400).json({
                success: false,
                message: "Doctor not available on this date",
            });
        }

        // Generate slots again (important security check)
        const slots = generateSlots(
            availability.startTime,
            availability.endTime,
            availability.slotDuration
        );

        if (!slots.includes(slotTime)) {
            return res.status(400).json({
                success: false,
                message: "Invalid slot selected",
            });
        }

        // Check if already booked (ACTIVE booking only)
        const alreadyBooked = await AppointmentModel.findOne({
            doctorId,
            hospitalId,
            date,
            slotTime,
            status: "booked",
        });

        if (alreadyBooked) {
            return res.status(400).json({
                success: false,
                message: "This slot is already booked",
            });
        }

        // Create appointment
        const appointment = await AppointmentModel.create({
            patientId,
            doctorId,
            hospitalId,
            departmentId,
            date,
            slotTime,
            status: "booked",
        });

        return res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            appointment,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};



/* =========================================================
   GET ALL APPOINTMENTS OF A PATIENT
   ========================================================= */

export const getPatientAppointments = async (req: Request, res: Response) => {
    try {
        const { patientId } = req.params;

        const appointments = await AppointmentModel.find({ patientId })
            .populate("doctorId", "name specialization")
            .populate("hospitalId", "name city")
            .populate("departmentId", "name")
            .sort({ date: -1 });

        return res.status(200).json({
            success: true,
            total: appointments.length,
            appointments,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};



/* =========================================================
   CANCEL APPOINTMENT
   ========================================================= */

export const cancelAppointment = async (req: Request, res: Response) => {
    try {
        const { appointmentId } = req.params;

        const appointment = await AppointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        if (appointment.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Appointment already cancelled",
            });
        }

        // Change status → slot becomes available again
        appointment.status = "cancelled";
        await appointment.save();

        return res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully",
            appointment,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};



/* =========================================================
   GET ALL APPOINTMENTS FOR A HOSPITAL (Admin)
   ========================================================= */

export const getAllAppointments = async (req: Request, res: Response) => {
    try {
        const { hospitalId } = req.params;
        const { status, departmentId, doctorId } = req.query;

        const filter: any = { hospitalId };

        if (status && status !== "all") {
            filter.status = status;
        }

        if (departmentId) {
            filter.departmentId = departmentId;
        }

        if (doctorId) {
            filter.doctorId = doctorId;
        }

        const appointments = await AppointmentModel.find(filter)
            .populate("patientId", "name email mobileNumber")
            .populate("doctorId", "name specialization")
            .populate("hospitalId", "name city")
            .populate("departmentId", "name")
            .sort({ date: -1, slotTime: -1 });

        return res.status(200).json({
            success: true,
            total: appointments.length,
            appointments,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};



/* =========================================================
   COMPLETE APPOINTMENT (Admin)
   ========================================================= */

export const completeAppointment = async (req: Request, res: Response) => {
    try {
        const { appointmentId } = req.params;

        const appointment = await AppointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        if (appointment.status !== "booked") {
            return res.status(400).json({
                success: false,
                message: `Cannot complete an appointment with status "${appointment.status}"`,
            });
        }

        appointment.status = "completed";
        await appointment.save();

        return res.status(200).json({
            success: true,
            message: "Appointment marked as completed",
            appointment,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};



/* =========================================================
   GET ALL APPOINTMENTS OF A DOCTOR
   ========================================================= */

export const getDoctorAppointments = async (req: Request, res: Response) => {
    try {
        const { doctorId } = req.params;
        const { status } = req.query;

        const filter: any = { doctorId };

        if (status && status !== "all") {
            filter.status = status;
        }

        const appointments = await AppointmentModel.find(filter)
            .populate("patientId", "name email mobileNumber")
            .populate("doctorId", "name specialization")
            .populate("hospitalId", "name city")
            .populate("departmentId", "name")
            .sort({ date: -1, slotTime: -1 });

        return res.status(200).json({
            success: true,
            total: appointments.length,
            appointments,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};