import { Router } from "express";
import { getSession, login, logout } from "./auth.controller";
import { guardMiddleware } from "../middleware/Gaurd.middleware";
const AuthRouter = Router();

AuthRouter.post("/login",login) ;
AuthRouter.get("/session",guardMiddleware,getSession)
AuthRouter.post("/logout", logout);

export default AuthRouter ;
