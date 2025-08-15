import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/monogodb';
import Room from '@/models/Room';

// POST /api/rooms/[code]/leave - Leave a room
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await dbConnect();

    let playerId: string;
    const { code } = await params;

    try {
      const body = await request.json();
      playerId = body.playerId;
    } catch (parseError) {
      // Handle beacon requests or malformed JSON
      const text = await request.text();
      try {
        const parsed = JSON.parse(text);
        playerId = parsed.playerId;
      } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
      }
    }

    if (!playerId) {
      return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
    }

    const room = await Room.findOne({ code, isActive: true });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const playerIndex = room.players.findIndex((p: any) => p.id === playerId);

    if (playerIndex === -1) {
      return NextResponse.json({ error: 'Player not found in room' }, { status: 404 });
    }

    const leavingPlayer = room.players[playerIndex];
    room.players.splice(playerIndex, 1);

    // If host leaves, make next player host
    if (leavingPlayer.isHost && room.players.length > 0) {
      room.players[0].isHost = true;
    }

    // Delete room if empty
    if (room.players.length === 0) {
      await Room.findByIdAndDelete(room._id);
      return NextResponse.json({ success: true, roomDeleted: true });
    } else {
      await room.save();
      return NextResponse.json({
        success: true,
        room: room.toObject(),
        roomDeleted: false,
      });
    }
  } catch (error) {
    console.error('Error leaving room:', error);
    return NextResponse.json({ error: 'Failed to leave room' }, { status: 500 });
  }
}
