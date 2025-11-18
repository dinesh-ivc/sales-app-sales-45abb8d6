import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';
import { loginSchema } from '@/lib/validation';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    // Connect to database
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return user data and token
    return Response.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    }, { status: 200 });

  } catch (error) {
    if (error.name === 'ZodError') {
      return Response.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}