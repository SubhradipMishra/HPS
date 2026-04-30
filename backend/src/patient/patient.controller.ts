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

export const addReport = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    const fileName = req.file ? req.file.filename : undefined;

    if (!fileName || !category) {
      return res.status(400).json({ message: "File and category are required" });
    }

    const patient = await PatientModel.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    patient.reports.push({
      fileName,
      category,
      uploadDate: new Date()
    } as any);

    await patient.save();
    res.json({ message: "Report added to vault", patient });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const removeReport = async (req: Request, res: Response) => {
  try {
    const { id, reportId } = req.params;
    const patient = await PatientModel.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    patient.reports = (patient.reports as any).filter((r: any) => r._id?.toString() !== reportId);
    await patient.save();
    res.json({ message: "Report removed from vault", patient });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};