
import { Router } from "express";
import { CreateHospital } from "./hospital.controller";

const HospitalRouter = Router();

HospitalRouter.post("/",CreateHospital);

export default HospitalRouter; 
