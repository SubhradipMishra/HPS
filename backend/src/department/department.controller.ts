import { Request, Response } from "express";

import DepartmentModel from "./department.model";
export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, description, code } = req.body;

    const admin = (req as any).user;

    const department = await DepartmentModel.create({
      name,
      description,
      code,
      hospitalId: admin.hospitalId,
      createdBy: admin.id,
    });

    res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Department already exists in this hospital",
      });
    }

    res.status(500).json({
      message: "Error creating department",
      error: error.message,
    });
  }
};

export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).user;

    const departments = await DepartmentModel.find({
      hospitalId: admin.hospitalId,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Departments fetched successfully",
      departments,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching departments",
      error: error.message,
    });
  }
};