import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/monogodb';
import Room from '@/models/Room';

// GET /api/game/[code] - Get current game state
export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    await dbConnect();

    const { code } = await params;
    const room = await Room.findOne({ code, isActive: true });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json(room.toObject());
  } catch (error) {
    console.error('Error fetching game state:', error);
    return NextResponse.json({ error: 'Failed to fetch game state' }, { status: 500 });
  }
}
