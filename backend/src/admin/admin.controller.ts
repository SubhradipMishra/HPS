import { Request, Response } from "express";

export class AdminController {
  static async getAll(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "Get all admins" });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      res.status(201).json({ message: "Create admin" });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
