
import { Router } from "express";
import { createDoctorAvailability } from "./doctoravailability.controller";
import { adminOnly } from "../middleware/Gaurd.middleware";

const DoctorAvailabilityRouter = Router();
DoctorAvailabilityRouter.post("/create", adminOnly, createDoctorAvailability);


export default DoctorAvailabilityRouter;