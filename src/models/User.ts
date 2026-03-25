import { Schema, model, models, type Document, type Model } from "mongoose";

export type UserRole = "admin" | "customer";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = IUser & Document;

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "customer"], default: "customer" }
  },
  { timestamps: true }
);

const User = (models.User as Model<UserDocument>) || model<UserDocument>("User", userSchema);

export default User;
