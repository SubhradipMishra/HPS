import { Document } from "mongoose";

interface IHospital extends Document {
    name: string;
    address: string;
    city: string;
    state: string;
    regNo: string;

    location: {
        type: "Point";
        coordinates: [number, number]; // [longitude, latitude]
    };

    createdAt: Date;
    updatedAt: Date;
}

export default IHospital;