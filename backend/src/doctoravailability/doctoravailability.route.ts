import { Router } from "express";
import {
    createDoctorAvailability,
    deleteDoctorAvailability,
    getDoctorAvailabilities,
} from "./doctoravailability.controller";
import { adminOnly } from "../middleware/Gaurd.middleware";

const DoctorAvailabilityRouter = Router();

DoctorAvailabilityRouter.post("/create", adminOnly, createDoctorAvailability);
DoctorAvailabilityRouter.get(
    "/:doctorId/:hospitalId",
    adminOnly,
    getDoctorAvailabilities
);
DoctorAvailabilityRouter.delete("/:id", adminOnly, deleteDoctorAvailability);

export default DoctorAvailabilityRouter;