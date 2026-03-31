// In your login controller
import { Request, Response } from "express";
import { loginService } from "./auth.service";

export const login = async (req: Request, res: Response) => {
  try {
    console.log("HIT LOGIN....");
    const { identifier, password } = req.body;
    const result = await loginService(identifier, password);

    
    res.cookie("AuthToken", result.token, {
      httpOnly: true,        // not accessible via JS
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms (matches JWT expiresIn)
    });

    res.status(200).json({
      role: result.role,
      user: result.user,
    });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const getSession = async(req:any , res:Response)=>{
  return res.json(req.user);
}