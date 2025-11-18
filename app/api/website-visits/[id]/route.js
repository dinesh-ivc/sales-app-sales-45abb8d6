import { connectToDatabase } from '@/lib/mongodb';
import WebsiteVisit from '@/models/WebsiteVisit';
import { authenticateToken } from '@/lib/jwt';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = authenticateToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    await connectToDatabase();
    const visit = await WebsiteVisit.findOne({ _id: params.id, user: userId });

    if (!visit) {
      return NextResponse.json({ error: 'Website visit not found' }, { status: 404 });
    }

    return NextResponse.json({
      _id: visit._id,
      user: visit.user,
      url: visit.url,
      ip: visit.ip,
      userAgent: visit.userAgent,
      referrer: visit.referrer,
      timestamp: visit.timestamp,
      duration: visit.duration,
      pageViews: visit.pageViews,
      conversion: visit.conversion
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch website visit' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = authenticateToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    const data = await request.json();
    const { url, ip, userAgent, referrer, timestamp, duration, pageViews, conversion } = data;

    await connectToDatabase();
    const visit = await WebsiteVisit.findOneAndUpdate(
      { _id: params.id, user: userId },
      { 
        url,
        ip,
        userAgent,
        referrer,
        timestamp: new Date(timestamp),
        duration,
        pageViews,
        conversion
      },
      { new: true, runValidators: true }
    );

    if (!visit) {
      return NextResponse.json({ error: 'Website visit not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({
      _id: visit._id,
      user: visit.user,
      url: visit.url,
      ip: visit.ip,
      userAgent: visit.userAgent,
      referrer: visit.referrer,
      timestamp: visit.timestamp,
      duration: visit.duration,
      pageViews: visit.pageViews,
      conversion: visit.conversion
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update website visit' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = authenticateToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    await connectToDatabase();
    const visit = await WebsiteVisit.findOneAndDelete({ _id: params.id, user: userId });

    if (!visit) {
      return NextResponse.json({ error: 'Website visit not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Website visit deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete website visit' }, { status: 500 });
  }
}