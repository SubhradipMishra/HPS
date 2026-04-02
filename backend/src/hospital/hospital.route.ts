
import { Router } from "express";
import { CreateHospital, getNearbyHospitals, GetHospital } from "./hospital.controller";

const HospitalRouter = Router();

HospitalRouter.post("/", CreateHospital);
HospitalRouter.get("/", GetHospital);
HospitalRouter.get("/nearby", getNearbyHospitals);
export default HospitalRouter; 
