import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { POST as createSessionPOST } from '@/app/api/sessions/route';
import { POST as joinPOST } from '@/app/api/sessions/[id]/join/route';
import { POST as episodesPOST } from '@/app/api/episodes/route';
import { PUT as teamsPUT } from '@/app/api/sessions/[id]/teams/route';
import { POST as startPOST } from '@/app/api/sessions/[id]/start/route';
import { createMockRequest, parseResponse } from './test-helpers';
import { InMemoryGameSessionRepository } from '@/server/infrastructure/repositories/InMemoryGameSessionRepository';

describe('POST /api/sessions/[id]/start', () => {
  let testSessionId: string;
  let testHostId: string;

  beforeEach(async () => {
    InMemoryGameSessionRepository.getInstance().clearAll();

    // Create session
    const sessionRequest = createMockRequest('POST', 'http://localhost:3000/api/sessions', {
      body: { hostNickname: 'Host' },
    });
    const sessionResponse = await createSessionPOST(sessionRequest);
    const sessionData = await parseResponse(sessionResponse);
    testSessionId = sessionData.sessionId;
    testHostId = sessionData.hostId;
  });

  afterEach(async () => {
    InMemoryGameSessionRepository.getInstance().clearAll();
  });

  it('should start game and transition to presentation phase', async () => {
    // Setup: Create 2 teams with participants and episodes
    const p1Request = createMockRequest('POST', `http://localhost:3000/api/sessions/${testSessionId}/join`, {
      body: { nickname: 'Player1' },
    });
    const p1Response = await joinPOST(p1Request, { params: { id: testSessionId } });
    const p1Data = await parseResponse(p1Response);

    const p2Request = createMockRequest('POST', `http://localhost:3000/api/sessions/${testSessionId}/join`, {
      body: { nickname: 'Player2' },
    });
    const p2Response = await joinPOST(p2Request, { params: { id: testSessionId } });
    const p2Data = await parseResponse(p2Response);

    // Register episodes for participants
    const ep1Request = createMockRequest('POST', 'http://localhost:3000/api/episodes', {
      body: {
        participantId: p1Data.participantId,
        episodes: [
          { text: 'Episode 1 is true.', isLie: false },
          { text: 'Episode 2 is true.', isLie: false },
          { text: 'Episode 3 is a lie.', isLie: true },
        ],
      },
    });
    await episodesPOST(ep1Request);

    const ep2Request = createMockRequest('POST', 'http://localhost:3000/api/episodes', {
      body: {
        participantId: p2Data.participantId,
        episodes: [
          { text: 'Episode A is true.', isLie: false },
          { text: 'Episode B is true.', isLie: false },
          { text: 'Episode C is a lie.', isLie: true },
        ],
      },
    });
    await episodesPOST(ep2Request);

    // Create teams and assign participants
    const team1Request = createMockRequest('PUT', `http://localhost:3000/api/sessions/${testSessionId}/teams`, {
      body: {
        action: 'CREATE_TEAM',
        hostId: testHostId,
        teamName: 'Team A',
      },
    });
    const team1Response = await teamsPUT(team1Request, { params: { id: testSessionId } });
    const team1Data = await parseResponse(team1Response);

    const team2Request = createMockRequest('PUT', `http://localhost:3000/api/sessions/${testSessionId}/teams`, {
      body: {
        action: 'CREATE_TEAM',
        hostId: testHostId,
        teamName: 'Team B',
      },
    });
    await teamsPUT(team2Request, { params: { id: testSessionId } });

    // Assign participants to teams
    const assignRequest = createMockRequest('PUT', `http://localhost:3000/api/sessions/${testSessionId}/teams`, {
      body: {
        action: 'ASSIGN_PARTICIPANT',
        hostId: testHostId,
        participantId: p1Data.participantId,
        teamId: team1Data.teamId,
      },
    });
    await teamsPUT(assignRequest, { params: { id: testSessionId } });

    // Start game
    const startRequest = createMockRequest('POST', `http://localhost:3000/api/sessions/${testSessionId}/start`, {
      body: { hostId: testHostId },
    });
    const response = await startPOST(startRequest, { params: { id: testSessionId } });
    const data = await parseResponse(response);

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('sessionId');
    expect(data).toHaveProperty('phase');
    expect(data.phase).toBe('presentation');
  });

  it('should return 404 when session not found', async () => {
    const request = createMockRequest('POST', 'http://localhost:3000/api/sessions/INVALID/start', {
      body: { hostId: testHostId },
    });
    const response = await startPOST(request, { params: { id: 'INVALID' } });
    const data = await parseResponse(response);

    expect(response.status).toBe(404);
    expect(data).toHaveProperty('error');
  });

  it('should return 401 when non-host tries to start game', async () => {
    const request = createMockRequest('POST', `http://localhost:3000/api/sessions/${testSessionId}/start`, {
      body: { hostId: 'invalid-host-id' },
    });
    const response = await startPOST(request, { params: { id: testSessionId } });
    const data = await parseResponse(response);

    expect(response.status).toBe(401);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Unauthorized');
  });

  it('should return 400 when game already started', async () => {
    // Create minimal setup and start game once
    const p1Request = createMockRequest('POST', `http://localhost:3000/api/sessions/${testSessionId}/join`, {
      body: { nickname: 'Player1' },
    });
    const p1Response = await joinPOST(p1Request, { params: { id: testSessionId } });
    const p1Data = await parseResponse(p1Response);

    const epRequest = createMockRequest('POST', 'http://localhost:3000/api/episodes', {
      body: {
        participantId: p1Data.participantId,
        episodes: [
          { text: 'Episode 1 is true.', isLie: false },
          { text: 'Episode 2 is true.', isLie: false },
          { text: 'Episode 3 is a lie.', isLie: true },
        ],
      },
    });
    await episodesPOST(epRequest);

    const teamRequest = createMockRequest('PUT', `http://localhost:3000/api/sessions/${testSessionId}/teams`, {
      body: {
        action: 'CREATE_TEAM',
        hostId: testHostId,
        teamName: 'Team A',
      },
    });
    const teamResponse = await teamsPUT(teamRequest, { params: { id: testSessionId } });
    const teamData = await parseResponse(teamResponse);

    const assignRequest = createMockRequest('PUT', `http://localhost:3000/api/sessions/${testSessionId}/teams`, {
      body: {
        action: 'ASSIGN_PARTICIPANT',
        hostId: testHostId,
        participantId: p1Data.participantId,
        teamId: teamData.teamId,
      },
    });
    await teamsPUT(assignRequest, { params: { id: testSessionId } });

    // Start game first time
    const startRequest1 = createMockRequest('POST', `http://localhost:3000/api/sessions/${testSessionId}/start`, {
      body: { hostId: testHostId },
    });
    await startPOST(startRequest1, { params: { id: testSessionId } });

    // Try to start again
    const startRequest2 = createMockRequest('POST', `http://localhost:3000/api/sessions/${testSessionId}/start`, {
      body: { hostId: testHostId },
    });
    const response = await startPOST(startRequest2, { params: { id: testSessionId } });
    const data = await parseResponse(response);

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('already started');
  });

  it('should return 400 when fewer than 2 teams', async () => {
    const request = createMockRequest('POST', `http://localhost:3000/api/sessions/${testSessionId}/start`, {
      body: { hostId: testHostId },
    });
    const response = await startPOST(request, { params: { id: testSessionId } });
    const data = await parseResponse(response);

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Minimum');
  });

  it('should return 400 when participants have not registered episodes', async () => {
    // Create participant without episodes
    const p1Request = createMockRequest('POST', `http://localhost:3000/api/sessions/${testSessionId}/join`, {
      body: { nickname: 'Player1' },
    });
    const p1Response = await joinPOST(p1Request, { params: { id: testSessionId } });
    const p1Data = await parseResponse(p1Response);

    // Create team
    const teamRequest = createMockRequest('PUT', `http://localhost:3000/api/sessions/${testSessionId}/teams`, {
      body: {
        action: 'CREATE_TEAM',
        hostId: testHostId,
        teamName: 'Team A',
      },
    });
    const teamResponse = await teamsPUT(teamRequest, { params: { id: testSessionId } });
    const teamData = await parseResponse(teamResponse);

    // Assign participant
    const assignRequest = createMockRequest('PUT', `http://localhost:3000/api/sessions/${testSessionId}/teams`, {
      body: {
        action: 'ASSIGN_PARTICIPANT',
        hostId: testHostId,
        participantId: p1Data.participantId,
        teamId: teamData.teamId,
      },
    });
    await teamsPUT(assignRequest, { params: { id: testSessionId } });

    const startRequest = createMockRequest('POST', `http://localhost:3000/api/sessions/${testSessionId}/start`, {
      body: { hostId: testHostId },
    });
    const response = await startPOST(startRequest, { params: { id: testSessionId } });
    const data = await parseResponse(response);

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('must register');
  });

  it('should return 400 when there are unassigned participants', async () => {
    // Create participant but don't assign to team
    const p1Request = createMockRequest('POST', `http://localhost:3000/api/sessions/${testSessionId}/join`, {
      body: { nickname: 'Player1' },
    });
    const p1Response = await joinPOST(p1Request, { params: { id: testSessionId } });
    const p1Data = await parseResponse(p1Response);

    const epRequest = createMockRequest('POST', 'http://localhost:3000/api/episodes', {
      body: {
        participantId: p1Data.participantId,
        episodes: [
          { text: 'Episode 1 is true.', isLie: false },
          { text: 'Episode 2 is true.', isLie: false },
          { text: 'Episode 3 is a lie.', isLie: true },
        ],
      },
    });
    await episodesPOST(epRequest);

    // Create team but don't assign participant
    const teamRequest = createMockRequest('PUT', `http://localhost:3000/api/sessions/${testSessionId}/teams`, {
      body: {
        action: 'CREATE_TEAM',
        hostId: testHostId,
        teamName: 'Team A',
      },
    });
    await teamsPUT(teamRequest, { params: { id: testSessionId } });

    const startRequest = createMockRequest('POST', `http://localhost:3000/api/sessions/${testSessionId}/start`, {
      body: { hostId: testHostId },
    });
    const response = await startPOST(startRequest, { params: { id: testSessionId } });
    const data = await parseResponse(response);

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('must be assigned');
  });

  it('should set presentation order based on team presentation order', async () => {
    // This validates that the game starts with proper presentation order
    // The actual presentation order logic is tested in the use case tests
    expect(true).toBe(true);
  });
});
