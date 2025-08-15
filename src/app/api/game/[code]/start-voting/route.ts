import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/monogodb';
import Room from '@/models/Room';

// POST /api/game/[code]/start-voting - Transition to voting phase
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await dbConnect();

    const { code } = await params;
    const room = await Room.findOne({ code, isActive: true });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (room.gameState !== 'word_reveal') {
      return NextResponse.json({ error: 'Not in word reveal phase' }, { status: 400 });
    }

    // Transition to voting phase
    room.gameState = 'voting';

    await room.save();

    return NextResponse.json(room.toObject());
  } catch (error) {
    console.error('Error starting voting phase:', error);
    return NextResponse.json({ error: 'Failed to start voting phase' }, { status: 500 });
  }
}
