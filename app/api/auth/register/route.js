import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { validateRegisterInput } from '@/lib/validation';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { name, email, password } = body;

    // Validate input
    const validationResult = validateRegisterInput({ name, email, password });
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Validation failed',
          errors: validationResult.errors
        }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User already exists with this email'
        }),
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response with user data (excluding password) and token
    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      createdAt: savedUser.createdAt
    };

    const response = {
      success: true,
      message: 'User registered successfully',
      user: userResponse,
      token
    };

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: {
        'Set-Cookie': `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error during registration'
      }),
      { status: 500 }
    );
  }
}