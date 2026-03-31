import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import HospitalRouter from "./hospital/hospital.route";
import PatientRouter from "./patient/patient.route";
import AuthRouter from "./auth/auth.route";
import DepartmentRouter from "./department/department.route";
import { createDoctor } from "./doctor/doctor.controller";
import DoctorRouter from "./doctor/doctor.route";

dotenv.config(); 


mongoose.connect(process.env.DB_URL as string)
.then(()=> console.log("Database connected....."))
.catch(()=>console.log("Database failed to connect...."))

const app = express() ;


app.use(express.urlencoded({extended:true})) ;
app.use(express.json()) ; 
app.use(cors({
    origin:process.env.FRONTEND_URL as string,
    credentials:true
    
}))

app.use(cookieParser());



app.use('/hospital',HospitalRouter);
app.use("/patient",PatientRouter);
app.use("/auth",AuthRouter);
app.use("/department",DepartmentRouter);
app.use("/doctor",DoctorRouter) ;


app.listen(process.env.PORT,()=> console.log(`Server running on ${process.env.PORT}`))