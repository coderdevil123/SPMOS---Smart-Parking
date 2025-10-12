import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  auth0Id?: string;   // optional if you use Auth0
  name: string;
  email: string;
  phone?: string;
  password?: string;  // added to support manual registration
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    auth0Id: { type: String, index: true, unique: true, sparse: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String },
    password: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
