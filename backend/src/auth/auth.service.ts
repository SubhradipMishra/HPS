import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PatientModel } from "../patient/patient.model";
import { AdminModel } from "../admin/admin.model";
import DoctorModel from "../doctor/doctor.model";



export const loginService = async (identifier: string, password: string) => {
  // 1️⃣ Check Admin first
  let user: any = await AdminModel.findOne({
    $or: [{ email: identifier }, { mobileNumber: identifier }],
  });

  if (user) {
    if (password != user.password) throw new Error("Invalid password");

    const token = jwt.sign(
      { id: user._id, role: "admin", hospitalId: user.hospitalId, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return {
      token,
      role: "admin",
      user: {
        id: user._id,
        hospitalId: user.hospitalId,
        name: user.name,
        email: user.email,
      },
    };
  }

  // 2️⃣ If not admin → check doctor
  user = await DoctorModel.findOne({
    $or: [{ email: identifier }, { mobileNumber: identifier }],
  });

  if (user) {
    if (password != user.password) throw new Error("Invalid password");

    const token = jwt.sign(
      { id: user._id, role: "doctor", hospitalId: user.hospitalId, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return {
      token,
      role: "doctor",
      user: {
        id: user._id,
        hospitalId: user.hospitalId,
        departmentId: user.departmentId,
        name: user.name,
        email: user.email,
        specialization: user.specialization,
      },
    };
  }

  // 3️⃣ If not admin or doctor → check patient
  user = await PatientModel.findOne({
    $or: [{ email: identifier }, { mobileNumber: identifier }],
  });

  if (!user) throw new Error("User not found");

  if (!user.password) {
    throw new Error("Account created by receptionist. Please set password first.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid password");

  const token = jwt.sign(
    { id: user._id, role: "patient", email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  return {
    token,
    role: "patient",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};