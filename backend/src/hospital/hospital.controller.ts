import { Request,Response } from "express"
import HospitalModel from "./hospital.model"
import IHospital from "./hospital.interface"

export const CreateHospital = async(req: Request, res: Response)=>{
  try{
    const hospitalData: IHospital = req.body;
    const newHospital = new HospitalModel(hospitalData);
    await newHospital.save() ;
    return res.status(200).json({message:"Hospital Created!"})

  }
  catch(err:any){
    return res.status(500).json({message:err.message})
  }
}
export const GetHospital = async(req:Request , res:Response) =>{
  try{
    const hospitals = await HospitalModel.find() ;
    return res.status(200).json(hospitals) ; 
  }
  catch(err:any){
    return res.status(500).json({message:err.message})
  }
}

export const GetHospitalById = async(req:any , res:Response)=>{
   try{
    if(!req.id) return res.status(500).json({message:"Id not found!"})
   }
  catch(err:any){
    return res.status(500).json({message:err.message})
  }
}