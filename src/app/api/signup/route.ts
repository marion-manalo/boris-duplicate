import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectMongoDB from '@/config/mongodb';
import User from '@/app/models/authSchema';

// create new user in the database
export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();

        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
        }
        
        // hashes and generates salt for the password
        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPass,
        });

        return NextResponse.json(
            { message: 'User created successfully', userId: newUser._id },
            { status: 201 }
        );
    } catch (error) {
        console.error('[Signup Error]', error);
        return NextResponse.json(
            { message: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
