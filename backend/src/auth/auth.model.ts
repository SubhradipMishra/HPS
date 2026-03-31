import mongoose, { Schema, Document } from "mongoose";

export interface IAuth extends Document {
  name: string;
  createdAt: Date;
}

const authSchema = new Schema<IAuth>({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Auth = mongoose.model<IAuth>("Auth", authSchema);
