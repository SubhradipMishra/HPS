"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const args = process.argv.slice(2);
if (args.length === 0) {
    console.log(chalk_1.default.red("Usage: npm run feature <feature-name>"));
    process.exit(1);
}
const featureName = args[0].toLowerCase();
const srcPath = path.join(__dirname, "..", "src");
const featurePath = path.join(srcPath, featureName);
// Create folder if not exists
if (!fs.existsSync(featurePath)) {
    fs.mkdirSync(featurePath, { recursive: true });
    console.log(chalk_1.default.green(`Folder created: src/${featureName}`));
}
else {
    console.log(chalk_1.default.yellow(`Folder already exists: src/${featureName}`));
}
// Helper to capitalize
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
// ---------------- Boilerplate Content ----------------
// 1️⃣ Controller - Class-based
const controllerContent = `import { Request, Response } from "express";

export class ${capitalize(featureName)}Controller {
  static async getAll(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "Get all ${featureName}s" });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      res.status(201).json({ message: "Create ${featureName}" });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
`;
// 2️⃣ Model - Mongoose
const modelContent = `import mongoose, { Schema, Document } from "mongoose";

export interface I${capitalize(featureName)} extends Document {
  name: string;
  createdAt: Date;
}

const ${featureName}Schema = new Schema<I${capitalize(featureName)}>({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const ${capitalize(featureName)} = mongoose.model<I${capitalize(featureName)}>("${capitalize(featureName)}", ${featureName}Schema);
`;
// 3️⃣ Route - Express Router
const routeContent = `import { Router } from "express";
import { ${capitalize(featureName)}Controller } from "./${featureName}.controller";

const router = Router();

router.get("/", ${capitalize(featureName)}Controller.getAll);
router.post("/", ${capitalize(featureName)}Controller.create);

export default router;
`;
// ---------------- Write Files ----------------
fs.writeFileSync(path.join(featurePath, `${featureName}.controller.ts`), controllerContent);
fs.writeFileSync(path.join(featurePath, `${featureName}.model.ts`), modelContent);
fs.writeFileSync(path.join(featurePath, `${featureName}.route.ts`), routeContent);
console.log(chalk_1.default.green(`Feature "${featureName}" files created successfully!`));
