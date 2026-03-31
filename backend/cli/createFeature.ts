import * as fs from "fs"; 
import * as path from "path";
import chalk from "chalk";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(chalk.red("Usage: npm run feature <feature-name>"));
  process.exit(1);
}

const featureName = args[0].toLowerCase();
const srcPath = path.join(__dirname, "..", "src");
const featurePath = path.join(srcPath, featureName);

// Create folder if not exists
if (!fs.existsSync(featurePath)) {
  fs.mkdirSync(featurePath, { recursive: true });
  console.log(chalk.green(`Folder created: src/${featureName}`));
} else {
  console.log(chalk.yellow(`Folder already exists: src/${featureName}`));
}

// Helper to capitalize
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

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

console.log(chalk.green(`Feature "${featureName}" files created successfully!`));