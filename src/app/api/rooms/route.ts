import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/monogodb';
import Room from '@/models/Room';

// GET /api/rooms - Get all active rooms
export async function GET() {
  try {
    await dbConnect();

    const rooms = await Room.find({ isActive: true }).sort({ createdAt: -1 }).limit(50);

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

// POST /api/rooms - Create a new room
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { playerName, roomName } = await request.json();

    if (!playerName?.trim()) {
      return NextResponse.json({ error: 'Player name is required' }, { status: 400 });
    }

    // Generate unique room code
    let roomCode: string;
    let attempts = 0;
    do {
      roomCode = Math.floor(100000 + Math.random() * 900000).toString();
      attempts++;
      if (attempts > 10) {
        throw new Error('Failed to generate unique room code');
      }
    } while (await Room.findOne({ code: roomCode }));

    // Generate player ID
    const playerId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

    const room = new Room({
      code: roomCode,
      name: roomName?.trim() || `${playerName.trim()}'s Room`,
      players: [
        {
          id: playerId,
          name: playerName.trim(),
          isHost: true,
          joinedAt: new Date(),
        },
      ],
      maxPlayers: 8,
      isActive: true,
    });

    await room.save();

    return NextResponse.json({
      room: room.toObject(),
      player: room.players[0],
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
