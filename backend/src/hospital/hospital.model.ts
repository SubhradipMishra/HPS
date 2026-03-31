import { model, Schema } from "mongoose";
import IHospital from "./hospital.interface";


const HospitalSchema = new Schema<IHospital>({
  name:{
    type:String,
    required:true,
    lowercase:true
  },
  location:{
     type:String,
    required:true,
    lowercase:true
  },
  regNo:{
     type:String,
    required:true,
    unique:true
   }
},{timestamps:true});

const HospitalModel = model<IHospital>("Hospital",HospitalSchema) ;
export default HospitalModel ; 