import { Response ,Request} from "express";
import { PatientModel } from "./patient.model";
import bcrypt from "bcrypt";



const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const CreatePatient = async(req:Request ,res:Response)=>{
  try{

  
   const { name, email, mobileNumber, password, dob, gender } = req.body;

      if (!name || !mobileNumber) {
        return res.status(400).json({ message: "Name and mobile number are required" });
      }

      // Check if email already exists
      if (email) {
        const existing = await PatientModel.findOne({ email });
        if (existing) {
          return res.status(400).json({ message: "Email already registered" });
        }
      }

      let hashedPassword: string | undefined = undefined;
      if (password) {
        hashedPassword = await hashPassword(password);
      }

      const patient = new PatientModel({
        name,
        email,
        mobileNumber,
        password: hashedPassword,
        dob,
        gender,
        createdBy: "self",
      });

      await patient.save();

      res.status(201).json({ message: "Patient registered successfully", patient });
    }
    catch (err) {
      console.error("Error creating patient:", err);
      res.status(500).json({ message: "Server error", error: err });
    }
  
}

export const createByReceptionist = async(req:Request , res:Response)=>{
   try {
      const { name, email, mobileNumber, dob, gender } = req.body;

      if (!name || !mobileNumber) {
        return res.status(400).json({ message: "Name and mobile number are required" });
      }

      if (email) {
        const existing = await PatientModel.findOne({ email });
        if (existing) {
          return res.status(400).json({ message: "Email already registered" });
        }
      }

      const patient = new PatientModel({
        name,
        email,
        mobileNumber,
        dob,
        gender,
        createdBy: "receptionist",
      });

      await patient.save();

      res.status(201).json({ message: "Patient created by receptionist", patient });
    } catch (err) {
      console.error("Error creating patient:", err);
      res.status(500).json({ message: "Server error", error: err });
    }
}
export const getAll = async(req:Request , res:Response)=>{
   try {
      const patient = await PatientModel.findById(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json({ patient });
    } catch (err) {
      console.error("Error fetching patient:", err);
      res.status(500).json({ message: "Server error", error: err });
    }
}

export const getByID = async(req:Request , res:Response)=>{
   try {
      const patient = await PatientModel.findById(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json({ patient });
    } catch (err) {
      console.error("Error fetching patient:", err);
      res.status(500).json({ message: "Server error", error: err });
    }
}