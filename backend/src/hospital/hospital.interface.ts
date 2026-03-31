
import { Document } from "mongoose"
interface IHospital extends Document {
    name:string,
    location:string,
    regNo:string,
    createdAt:Date
}

export default IHospital ;