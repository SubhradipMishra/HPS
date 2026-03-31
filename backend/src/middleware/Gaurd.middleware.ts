import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

// ✅ Base auth middleware — verifies token from cookie
export const guardMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.AuthToken;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Admin only middleware
export const adminOnly = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.AuthToken;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    console.log("decoded",decoded);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Patient only middleware
export const patientOnly = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.AuthToken;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (decoded.role !== "patient") {
      return res.status(403).json({ message: "Access denied. Patients only." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};