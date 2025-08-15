import { Room, Player } from '@/types/room';

class RoomService {
  private baseUrl = '/api/rooms';

  async createRoom(playerName: string, roomName?: string): Promise<{ room: Room; player: Player }> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerName, roomName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create room');
    }

    const data = await response.json();
    return {
      room: this.transformRoom(data.room),
      player: this.transformPlayer(data.player),
    };
  }

  async joinRoom(roomCode: string, playerName: string): Promise<{ room: Room; player: Player }> {
    const response = await fetch(`${this.baseUrl}/${roomCode}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to join room');
    }

    const data = await response.json();
    return {
      room: this.transformRoom(data.room),
      player: this.transformPlayer(data.player),
    };
  }

  async leaveRoom(
    roomCode: string,
    playerId: string
  ): Promise<{ success: boolean; roomDeleted: boolean }> {
    const response = await fetch(`${this.baseUrl}/${roomCode}/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to leave room');
    }

    return await response.json();
  }

  async getRoom(roomCode: string): Promise<Room> {
    const response = await fetch(`${this.baseUrl}/${roomCode}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get room');
    }

    const data = await response.json();
    return this.transformRoom(data.room);
  }

  async getRooms(): Promise<Room[]> {
    const response = await fetch(this.baseUrl);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get rooms');
    }

    const data = await response.json();
    return data.rooms.map((room: any) => this.transformRoom(room));
  }

  private transformRoom(room: any): Room {
    return {
      ...room,
      createdAt: new Date(room.createdAt),
      players: room.players.map((player: any) => this.transformPlayer(player)),
    };
  }

  private transformPlayer(player: any): Player {
    return {
      ...player,
      joinedAt: new Date(player.joinedAt),
    };
  }
}

export const roomService = new RoomService();
