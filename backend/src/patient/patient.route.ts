

import { Router } from "express";
import { createByReceptionist, CreatePatient, getAll, getByID } from "./patient.controller";

const PatientRouter = Router();

PatientRouter.post("/signup",CreatePatient);
PatientRouter.post("/receptionsit",createByReceptionist) ; 
PatientRouter.get("/",getAll);
PatientRouter.get("/:id",getByID) ;

export default PatientRouter ; 