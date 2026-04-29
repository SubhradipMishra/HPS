import { Router } from "express";
import { bookAppointment, cancelAppointment, completeAppointment, getAllAppointments, getAvailableSlots, getDoctorAppointments, getPatientAppointments, submitReview, uploadPatientReport } from "./appointment.controller";
import { adminOnly, adminOrDoctor, guardMiddleware, patientOnly } from "../middleware/Gaurd.middleware";
import { upload } from "../utils/upload";


const AppointmentRouter = Router();


AppointmentRouter.get("/available-slots", getAvailableSlots);
AppointmentRouter.post('/book', guardMiddleware, bookAppointment);
AppointmentRouter.get("/patient/:patientId", getPatientAppointments);
AppointmentRouter.patch("/:appointmentId/cancel", cancelAppointment);
AppointmentRouter.patch("/:appointmentId/patient-report", patientOnly, upload.single('report'), uploadPatientReport);
AppointmentRouter.patch("/:appointmentId/review", patientOnly, submitReview);

// Admin & Doctor routes
AppointmentRouter.get("/hospital/:hospitalId", adminOnly, getAllAppointments);
AppointmentRouter.patch("/:appointmentId/complete", adminOrDoctor, upload.single('prescription'), completeAppointment);
AppointmentRouter.get("/doctor/:doctorId", guardMiddleware, getDoctorAppointments);

export default AppointmentRouter; 
