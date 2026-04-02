import { Request, Response } from "express";
import DoctorModel from "./doctor.model";

export const createDoctor = async (req: Request, res: Response) => {
  try {
    const { name, email, mobileNumber, specialization, experience, departmentId } = req.body;

    const admin = (req as any).user;
    console.log(admin);

    const doctor = await DoctorModel.create({
      name,
      email,
      mobileNumber,
      specialization,
      experience,
      departmentId,
      hospitalId: admin.hospitalId,
      createdBy: admin.id,
    });

    res.status(201).json({
      message: "Doctor created successfully",
      doctor,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Doctor with this email already exists",
      });
    }

    res.status(500).json({
      message: "Error creating doctor",
      error: error.message,
    });
  }
};


export const getDoctorsByHospital = async (req: Request, res: Response) => {
  try {
    const { hospitalId } = req.params;

    const doctors = await DoctorModel.find({ hospitalId, isActive: true })
      .populate("departmentId", "name")
      .populate("hospitalId", "name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    if (!doctors.length) {
      return res.status(404).json({
        message: "No doctors found for this hospital",
      });
    }

    res.status(200).json({
      message: "Doctors fetched successfully",
      total: doctors.length,
      doctors,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching doctors",
      error: error.message,
    });
  }
};





export const getDoctorsByDepartment = async (req: Request, res: Response) => {
  try {
    const { hospitalId, departmentId } = req.params;

    const doctors = await DoctorModel.find({
      hospitalId,
      departmentId,
      isActive: true,
    })
      .select("name specialization experience")
      .sort({ experience: -1 });

    if (!doctors.length) {
      return res.status(404).json({
        success: false,
        message: "No doctors found in this department",
      });
    }

    res.status(200).json({
      success: true,
      total: doctors.length,
      doctors,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching doctors",
      error: error.message,
    });
  }
};