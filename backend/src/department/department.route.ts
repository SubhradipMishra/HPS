import { Router } from "express";
import { adminOnly, guardMiddleware } from "../middleware/Gaurd.middleware";
import { createDepartment, getAllDepartments } from "./department.controller";


const DepartmentRouter = Router();

DepartmentRouter.post("/",adminOnly,createDepartment);
DepartmentRouter.get("/",guardMiddleware,getAllDepartments) ; 

export default DepartmentRouter;