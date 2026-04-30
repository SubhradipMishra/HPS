

import { Router } from "express";
import { addReport, createByReceptionist, CreatePatient, getAll, getByID, removeReport } from "./patient.controller";
import { upload } from "../utils/upload";

const PatientRouter = Router();

PatientRouter.post("/signup",CreatePatient);
PatientRouter.post("/receptionsit",createByReceptionist) ; 
PatientRouter.get("/",getAll);
PatientRouter.get("/:id",getByID) ;
PatientRouter.post("/:id/add-report", upload.single('report'), addReport);
PatientRouter.delete("/:id/remove-report/:reportId", removeReport);


export default PatientRouter ; 