import { Router } from "express";
import { adminOnly, guardMiddleware } from "../middleware/Gaurd.middleware";
import { createDoctor, getDoctorsByDepartment, getDoctorsByHospital } from "./doctor.controller";


const DoctorRouter = Router();
DoctorRouter.post("/", adminOnly, createDoctor);
DoctorRouter.get("/:hospitalId", guardMiddleware, getDoctorsByHospital);
DoctorRouter.get("/:hospitalId/:departmentId", getDoctorsByDepartment);

export default DoctorRouter;
