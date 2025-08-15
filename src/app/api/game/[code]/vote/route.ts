import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/monogodb';
import Room from '@/models/Room';
import { GameService } from '@/lib/gameService';

// POST /api/game/[code]/vote - Submit a vote
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await dbConnect();

    const { code } = await params;
    const { voterId, votedForId } = await request.json();

    if (!voterId || !votedForId) {
      return NextResponse.json(
        { error: 'Voter ID and voted for ID are required' },
        { status: 400 }
      );
    }

    const room = await Room.findOne({ code, isActive: true });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (room.gameState !== 'voting') {
      return NextResponse.json({ error: 'Not in voting phase' }, { status: 400 });
    }

    // Check if player already voted
    const existingVoteIndex = room.votes.findIndex((vote: any) => vote.voterId === voterId);

    if (existingVoteIndex >= 0) {
      // Update existing vote
      room.votes[existingVoteIndex].votedForId = votedForId;
    } else {
      // Add new vote
      room.votes.push({ voterId, votedForId });
    }

    // Mark player as having voted
    const voterIndex = room.players.findIndex((player: any) => player.id === voterId);
    if (voterIndex >= 0) {
      room.players[voterIndex].hasVoted = true;
      room.players[voterIndex].votedFor = votedForId;
    }

    // Check if all players have voted
    const allVoted = room.players.every((player: any) => player.hasVoted);

    console.log(
      'Vote submitted. Players voted status:',
      room.players.map((p: { name: any; hasVoted: any }) => ({
        name: p.name,
        hasVoted: p.hasVoted,
      }))
    );
    console.log('All voted:', allVoted);

    if (allVoted) {
      console.log('All players have voted, processing results...');
      // Calculate results
      const { voteCounts, mostVoted, isTie } = GameService.calculateVoteResults(
        room.votes,
        room.players
      );

      const outcome = GameService.determineRoundOutcome(mostVoted, room.imposterPlayerId, isTie);

      // Update scores
      const winners = GameService.calculateScoreUpdates(
        outcome,
        room.votes,
        room.imposterPlayerId,
        mostVoted
      );

      // Apply score updates
      room.players.forEach((player: any) => {
        if (winners.includes(player.id)) {
          player.score = (player.score || 0) + 1;
        }
      });

      // Store round result
      const roundResult = {
        round: room.currentRound,
        word: room.word,
        imposterPlayerId: room.imposterPlayerId,
        votes: [...room.votes],
        outcome,
        winners,
      };

      if (!room.roundResults) {
        room.roundResults = [];
      }
      room.roundResults.push(roundResult);

      // Move to results phase
      room.gameState = 'results';
    }

    await room.save();

    return NextResponse.json(room.toObject());
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json({ error: 'Failed to submit vote' }, { status: 500 });
  }
}
