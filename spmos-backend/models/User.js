import mongoose from "mongoose";

const userInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
}, { timestamps: true });

const UserInfo = mongoose.model("User", userInfoSchema, "user-info"); // explicitly sets collection name

export default UserInfo;
