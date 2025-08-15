import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/monogodb';
import Room from '@/models/Room';

// POST /api/rooms/[code]/join - Join a room
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await dbConnect();

    const { playerName } = await request.json();
    const { code } = await params;

    if (!playerName?.trim()) {
      return NextResponse.json({ error: 'Player name is required' }, { status: 400 });
    }

    const room = await Room.findOne({ code, isActive: true });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (room.players.length >= room.maxPlayers) {
      return NextResponse.json({ error: 'Room is full' }, { status: 400 });
    }

    // Check if player name already exists in room
    if (room.players.some((p: any) => p.name === playerName.trim())) {
      return NextResponse.json(
        { error: 'Player name already taken in this room' },
        { status: 400 }
      );
    }

    // Generate player ID
    const playerId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

    const newPlayer = {
      id: playerId,
      name: playerName.trim(),
      isHost: false,
      joinedAt: new Date(),
    };

    room.players.push(newPlayer);
    await room.save();

    return NextResponse.json({
      room: room.toObject(),
      player: newPlayer,
    });
  } catch (error) {
    console.error('Error joining room:', error);
    return NextResponse.json({ error: 'Failed to join room' }, { status: 500 });
  }
}
