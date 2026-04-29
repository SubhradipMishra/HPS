import mongoose from "mongoose";
import { input } from "@inquirer/prompts";
import chalk from "chalk";
import HospitalModel from "../hospital/hospital.model";

const MONGO_URI = "mongodb://127.0.0.1:27017/curesync";

async function createHospitalCLI() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(chalk.green("✅ Connected to MongoDB"));

    const name = await input({
      message: "Hospital Name:",
      validate: (val: string) => (val ? true : "Name is required"),
    });

    const address = await input({
      message: "Hospital Address:",
      validate: (val: string) => (val ? true : "Address is required"),
    });

    const city = await input({
      message: "City:",
      validate: (val: string) => (val ? true : "City is required"),
    });

    const state = await input({
      message: "State:",
      validate: (val: string) => (val ? true : "State is required"),
    });

    const latitude = await input({
      message: "Latitude (example: 30.7333):",
      validate: (val: string) =>
        !isNaN(Number(val)) ? true : "Enter a valid latitude",
    });

    const longitude = await input({
      message: "Longitude (example: 76.7794):",
      validate: (val: string) =>
        !isNaN(Number(val)) ? true : "Enter a valid longitude",
    });

    const regNo = await input({
      message: "Hospital Registration Number:",
      validate: async (val: string) => {
        if (!val) return "Registration number is required";
        const exists = await HospitalModel.findOne({ regNo: val });
        return exists ? "This regNo already exists" : true;
      },
    });

    const hospital = await HospitalModel.create({
      name,
      address,
      city,
      state,
      regNo,

      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },
    });

    console.log(chalk.blueBright("🏥 Hospital created successfully!"));
    console.log(hospital);

    process.exit(0);
  } catch (err: any) {
    if (err.code === 13297) {
      console.log(
        chalk.red(
          "MongoDB Error: Database already exists with different case. Use lowercase db name."
        )
      );
    } else {
      console.error(chalk.red("Error creating hospital:"), err.message || err);
    }
    process.exit(1);
  }
}

createHospitalCLI();