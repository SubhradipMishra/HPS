import mongoose from "mongoose";
import { select, input, password } from "@inquirer/prompts";
import chalk from "chalk";
import { AdminModel } from "../admin/admin.model";
import HospitalModel from "../hospital/hospital.model";

const MONGO_URI = "mongodb://127.0.0.1:27017/curesync";

async function createAdminCLI() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(chalk.green("✅ Connected to MongoDB"));

    const hospitals = await HospitalModel.find({}).lean();
    if (hospitals.length === 0) {
      console.log(chalk.red("❌ No hospitals found. Please create a hospital first."));
      process.exit(1);
    }

    const hospitalChoices = hospitals.map((h) => ({
      name: `${h.name} (${h.location})`,
      value: h._id.toString(),
    }));

    // ✅ select() replaces type: "list"
    const hospitalId = await select({
      message: "Select Hospital:",
      choices: hospitalChoices,
      pageSize: 10,
    });

    if (!hospitalId) {
      console.error(chalk.red("❌ No hospital selected."));
      process.exit(1);
    }

    // ✅ input() replaces type: "input"
    const name = await input({
      message: "Admin Name:",
      validate: (val: string) => (val ? true : "Name is required"),
    });

    const email = await input({
      message: "Admin Email:",
      validate: async (val: string) => {
        if (!val) return "Email is required";
        const exists = await AdminModel.findOne({ email: val });
        return exists ? "This email already exists" : true;
      },
    });

    // ✅ password() replaces type: "password"
    const adminPassword = await password({
      message: "Admin Password:",
      mask: "*",
      validate: (val: string) => (val ? true : "Password is required"),
    });

    const mobileNumber = await input({
      message: "Mobile Number:",
      validate: (val: string) => (val ? true : "Mobile number is required"),
    });

    const admin = await AdminModel.create({
      name,
      email,
      password: adminPassword,
      mobileNumber,
      hospitalId: new mongoose.Types.ObjectId(hospitalId),
    });

    console.log(chalk.blueBright("👤 Admin created successfully!"));
    console.log({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      mobileNumber: admin.mobileNumber,
      hospitalId: admin.hospitalId,
      role: admin.role,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
    });

    process.exit(0);
  } catch (err: any) {
    console.error(chalk.red("Error creating admin:"), err.message || err);
    process.exit(1);
  }
}

createAdminCLI();