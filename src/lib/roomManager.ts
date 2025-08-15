import { Room, Player } from '@/types/room';

class RoomManager {
  private rooms: Map<string, Room> = new Map();
  private listeners: Set<(rooms: Map<string, Room>) => void> = new Set();

  constructor() {
    this.loadFromStorage();
    this.createDemoRooms();
  }

  private createDemoRooms() {
    // Create some demo rooms for testing
    if (this.rooms.size === 0) {
      const demoRoom1 = this.createRoom('Demo Player', 'Demo Room 1');
      const demoRoom2 = this.createRoom('Test User', 'Test Room');

      // Override the codes to be predictable for testing
      this.rooms.delete(demoRoom1.code);
      this.rooms.delete(demoRoom2.code);

      demoRoom1.code = '123456';
      demoRoom1.id = '123456';
      demoRoom2.code = '654321';
      demoRoom2.id = '654321';

      this.rooms.set('123456', demoRoom1);
      this.rooms.set('654321', demoRoom2);

      this.saveToStorage();
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      const roomsData = Array.from(this.rooms.entries());
      localStorage.setItem('multiplayer-rooms', JSON.stringify(roomsData));
    }
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('multiplayer-rooms');
      if (stored) {
        try {
          const roomsData = JSON.parse(stored);
          this.rooms = new Map(
            roomsData.map(([code, room]: [string, any]) => [
              code,
              {
                ...room,
                createdAt: new Date(room.createdAt),
                players: room.players.map((p: any) => ({
                  ...p,
                  joinedAt: new Date(p.joinedAt),
                })),
              },
            ])
          );
        } catch (error) {
          console.error('Failed to load rooms from storage:', error);
        }
      }
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.rooms));
    this.saveToStorage();
  }

  subscribe(listener: (rooms: Map<string, Room>) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  createRoom(playerName: string, roomName?: string): Room {
    const roomCode = this.generateRoomCode();
    const playerId = this.generatePlayerId();

    const player: Player = {
      id: playerId,
      name: playerName,
      isHost: true,
      joinedAt: new Date(),
    };

    const room: Room = {
      id: roomCode,
      code: roomCode,
      name: roomName || `${playerName}'s Room`,
      players: [player],
      maxPlayers: 8,
      createdAt: new Date(),
      isActive: true,
    };

    this.rooms.set(roomCode, room);
    this.notifyListeners();
    return room;
  }

  joinRoom(
    roomCode: string,
    playerName: string
  ): { success: boolean; room?: Room; player?: Player } {
    const room = this.rooms.get(roomCode);

    if (!room) {
      return { success: false };
    }

    if (room.players.length >= room.maxPlayers) {
      return { success: false };
    }

    // Check if player name already exists in room
    if (room.players.some((p) => p.name === playerName)) {
      return { success: false };
    }

    const playerId = this.generatePlayerId();
    const player: Player = {
      id: playerId,
      name: playerName,
      isHost: false,
      joinedAt: new Date(),
    };

    room.players.push(player);
    this.rooms.set(roomCode, room);
    this.notifyListeners();

    return { success: true, room, player };
  }

  leaveRoom(roomCode: string, playerId: string): boolean {
    const room = this.rooms.get(roomCode);
    if (!room) return false;

    const playerIndex = room.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) return false;

    const leavingPlayer = room.players[playerIndex];
    room.players.splice(playerIndex, 1);

    // If host leaves, make next player host
    if (leavingPlayer.isHost && room.players.length > 0) {
      room.players[0].isHost = true;
    }

    // Remove room if empty
    if (room.players.length === 0) {
      this.rooms.delete(roomCode);
    } else {
      this.rooms.set(roomCode, room);
    }

    this.notifyListeners();
    return true;
  }

  getRoom(roomCode: string): Room | undefined {
    return this.rooms.get(roomCode);
  }

  getRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  private generateRoomCode(): string {
    let code: string;
    do {
      code = Math.floor(100000 + Math.random() * 900000).toString();
    } while (this.rooms.has(code));
    return code;
  }

  private generatePlayerId(): string {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  // Cleanup old rooms (optional)
  cleanupOldRooms() {
    const now = new Date();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [code, room] of this.rooms.entries()) {
      if (now.getTime() - room.createdAt.getTime() > maxAge) {
        this.rooms.delete(code);
      }
    }
    this.notifyListeners();
  }
}

export const roomManager = new RoomManager();
