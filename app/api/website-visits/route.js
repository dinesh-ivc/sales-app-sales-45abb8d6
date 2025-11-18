import { connectToDatabase } from '@/lib/mongodb';
import WebsiteVisit from '@/models/WebsiteVisit';
import { verifyToken } from '@/lib/jwt';
import { websiteVisitSchema } from '@/lib/validation';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const websiteVisits = await WebsiteVisit.find({}).sort({ createdAt: -1 });

    return Response.json(websiteVisits, { status: 200 });
  } catch (error) {
    console.error('Error fetching website visits:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    try {
      websiteVisitSchema.parse(body);
    } catch (validationError) {
      return Response.json({ error: 'Validation failed', details: validationError.errors }, { status: 400 });
    }

    await connectToDatabase();

    const newWebsiteVisit = new WebsiteVisit({
      ...body,
      date: new Date(body.date),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newWebsiteVisit.save();

    return Response.json(newWebsiteVisit, { status: 201 });
  } catch (error) {
    console.error('Error creating website visit:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}