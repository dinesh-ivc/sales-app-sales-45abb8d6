import { connectToDatabase } from '@/lib/mongodb';
import StoreVisit from '@/models/StoreVisit';
import { verifyToken } from '@/lib/jwt';
import { storeVisitSchema } from '@/lib/validation';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return Response.json({ error: 'Authorization header missing' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    await connectToDatabase();
    const storeVisits = await StoreVisit.find({}).sort({ visitDate: -1 });

    return Response.json(storeVisits, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch store visits' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return Response.json({ error: 'Authorization header missing' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = storeVisitSchema.parse(body);

    await connectToDatabase();
    const newStoreVisit = new StoreVisit({
      ...validatedData,
      visitDate: new Date(validatedData.visitDate)
    });

    const savedStoreVisit = await newStoreVisit.save();

    return Response.json(savedStoreVisit, { status: 201 });
  } catch (error) {
    if (error.name === 'ZodError') {
      return Response.json({ error: 'Validation failed', issues: error.errors }, { status: 400 });
    }
    return Response.json({ error: 'Failed to create store visit' }, { status: 500 });
  }
}