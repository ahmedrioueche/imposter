import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/monogodb';
import Room from '@/models/Room';

// GET /api/rooms/[code] - Get room by code
export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    await dbConnect();

    const { code } = await params;
    const room = await Room.findOne({ code, isActive: true });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json({ room: room.toObject() });
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json({ error: 'Failed to fetch room' }, { status: 500 });
  }
}

// DELETE /api/rooms/[code] - Delete room
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await dbConnect();

    const { playerId } = await request.json();
    const { code } = await params;

    const room = await Room.findOne({ code, isActive: true });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Check if player is host
    const player = room.players.find((p: any) => p.id === playerId);
    if (!player?.isHost) {
      return NextResponse.json({ error: 'Only host can delete room' }, { status: 403 });
    }

    await Room.findByIdAndDelete(room._id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json({ error: 'Failed to delete room' }, { status: 500 });
  }
}
