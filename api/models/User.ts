// api/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  auth0Id?: string;   // if you use Auth0, store the sub here
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  auth0Id: { type: String, index: true, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
