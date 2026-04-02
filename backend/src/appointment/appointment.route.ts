import { Router } from "express";
import { bookAppointment, cancelAppointment, getAvailableSlots, getPatientAppointments } from "./appointment.controller";
import { guardMiddleware } from "../middleware/Gaurd.middleware";


const AppointmentRouter = Router();


AppointmentRouter.get("/available-slots", getAvailableSlots);
AppointmentRouter.post('/book', guardMiddleware, bookAppointment);
AppointmentRouter.get("/patient/:patientId", getPatientAppointments);
AppointmentRouter.patch("/:appointmentId/cancel", cancelAppointment);

export default AppointmentRouter; 
