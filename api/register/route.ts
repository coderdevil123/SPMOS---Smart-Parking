import { NextResponse } from "next/server";
import dbConnect from "../lib/mongodb";
import User from "../models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { name, email, password } = await req.json();

    // check if already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (err) {
    console.error("Error registering:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
