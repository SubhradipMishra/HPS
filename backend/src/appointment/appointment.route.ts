import { Router } from "express";
import { bookAppointment, cancelAppointment, completeAppointment, getAllAppointments, getAvailableSlots, getDoctorAppointments, getPatientAppointments } from "./appointment.controller";
import { adminOnly, guardMiddleware } from "../middleware/Gaurd.middleware";


const AppointmentRouter = Router();


AppointmentRouter.get("/available-slots", getAvailableSlots);
AppointmentRouter.post('/book', guardMiddleware, bookAppointment);
AppointmentRouter.get("/patient/:patientId", getPatientAppointments);
AppointmentRouter.patch("/:appointmentId/cancel", cancelAppointment);

// Admin & Doctor routes
AppointmentRouter.get("/hospital/:hospitalId", adminOnly, getAllAppointments);
AppointmentRouter.patch("/:appointmentId/complete", adminOnly, completeAppointment);
AppointmentRouter.get("/doctor/:doctorId", guardMiddleware, getDoctorAppointments);

export default AppointmentRouter; 
