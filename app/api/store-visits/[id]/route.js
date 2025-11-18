import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StoreVisit from '@/models/StoreVisit';
import { verifyToken } from '@/lib/jwt';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();

    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      verifyToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const storeVisit = await StoreVisit.findById(id);
    if (!storeVisit) {
      return NextResponse.json({ error: 'Store visit not found' }, { status: 404 });
    }

    return NextResponse.json(storeVisit, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch store visit' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    await connectToDatabase();

    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      verifyToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const updatedStoreVisit = await StoreVisit.findByIdAndUpdate(id, data, { new: true });
    if (!updatedStoreVisit) {
      return NextResponse.json({ error: 'Store visit not found' }, { status: 404 });
    }

    return NextResponse.json(updatedStoreVisit, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update store visit' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();

    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      verifyToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const deletedStoreVisit = await StoreVisit.findByIdAndDelete(id);
    if (!deletedStoreVisit) {
      return NextResponse.json({ error: 'Store visit not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Store visit deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete store visit' }, { status: 500 });
  }
}