import { Request, Response } from "express"
import HospitalModel from "./hospital.model"
import IHospital from "./hospital.interface"

export const CreateHospital = async (req: Request, res: Response) => {
  try {
    const hospitalData: IHospital = req.body;
    const newHospital = new HospitalModel(hospitalData);
    await newHospital.save();
    return res.status(200).json({ message: "Hospital Created!" })

  }
  catch (err: any) {
    return res.status(500).json({ message: err.message })
  }
}
export const GetHospital = async (req: Request, res: Response) => {
  try {
    const hospitals = await HospitalModel.find();
    return res.status(200).json({
      success: true,
      count: hospitals.length,
      hospitals,
    });
  }
  catch (err: any) {
    return res.status(500).json({ message: err.message })
  }
}

export const GetHospitalById = async (req: any, res: Response) => {
  try {
    if (!req.id) return res.status(500).json({ message: "Id not found!" })
  }
  catch (err: any) {
    return res.status(500).json({ message: err.message })
  }
}



export const getNearbyHospitals = async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng || !radius) {
      return res.status(400).json({
        success: false,
        message: "Latitude, Longitude and radius (in KM) are required",
      });
    }

    const hospitals = await HospitalModel.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: Number(radius) * 1000, // km → meters
        },
      },
      {
        $addFields: {
          distanceInKM: { $divide: ["$distance", 1000] },
        },
      },
      {
        $project: {
          name: 1,
          address: 1,
          city: 1,
          state: 1,
          distanceInKM: { $round: ["$distanceInKM", 2] },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      radius: `${radius} km`,
      count: hospitals.length,
      data: hospitals,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
