import { Router } from "express";
import { getSession, login } from "./auth.controller";
import { guardMiddleware } from "../middleware/Gaurd.middleware";
const AuthRouter = Router();

AuthRouter.post("/login",login) ;
AuthRouter.get("/session",guardMiddleware,getSession)

export default AuthRouter ;