import connectMongoDB from "@/config/mongodb";
import User from "../../models/authSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// POST request
export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();
        const { email, password } = await req.json();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists'}, {status:400});
        }

        const newUser = new User({ email, password })
        await newUser.save();


        return NextResponse.json({ message: 'User registered', userId: newUser._id}, {status: 201})
    } catch (err) {
        console.error('Login error: ', err);
        return NextResponse.json({ message: 'Internal server error'}, {status:500});
    }
}