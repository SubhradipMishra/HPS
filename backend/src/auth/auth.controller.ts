import { Request, Response } from "express";
import { loginService } from "./auth.service";
import { AdminModel } from "../admin/admin.model";
import { PatientModel } from "../patient/patient.model";

export const login = async (req: Request, res: Response) => {
  try {
    console.log("HIT LOGIN....");
    const { identifier, password } = req.body;
    const result = await loginService(identifier, password);

    console.log("HIT", identifier, password);


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

export const getSession = async (req: any, res: Response) => {
  try {
    if (req.user?.role === "admin") {
      const admin = await AdminModel.findById(req.user.id).select("name email hospitalId");

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      return res.json({
        id: admin._id,
        role: "admin",
        name: admin.name,
        email: admin.email,
        hospitalId: admin.hospitalId,
      });
    }

    if (req.user?.role === "patient") {
      const patient = await PatientModel.findById(req.user.id).select("name email mobileNumber dob gender");

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      return res.json({
        id: patient._id,
        role: "patient",
        name: patient.name,
        email: patient.email,
        mobileNumber: patient.mobileNumber,
        dob: patient.dob,
        gender: patient.gender,
      });
    }

    return res.status(401).json({ message: "Invalid session" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("AuthToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};
