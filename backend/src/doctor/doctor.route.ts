import { Router } from "express";
import { adminOnly, guardMiddleware } from "../middleware/Gaurd.middleware";
import { createDoctor, getDoctorsByHospital } from "./doctor.controller";


const DoctorRouter = Router();
DoctorRouter.post("/",adminOnly,createDoctor) ;
DoctorRouter.get("/:hospitalId",guardMiddleware,getDoctorsByHospital);

export default DoctorRouter;
