// This is a simple in-memory database for demonstration
// In a real app, you would use a real database like Supabase, MongoDB, etc.

import type { User, GameSession } from "@/lib/auth/auth-types"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"

// In-memory storage
const users: User[] = []
const gameSessions: GameSession[] = []
const gameHistory: Record<string, any[]> = {} // Store previous states for redo functionality

// User functions
export async function createUser(username: string, password: string): Promise<User | null> {
  // Check if user already exists
  const existingUser = users.find((u) => u.username === username)
  if (existingUser) {
    return null
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create new user
  const newUser: User = {
    id: uuidv4(),
    username,
    password: hashedPassword,
    createdAt: new Date(),
  }

  users.push(newUser)
  return newUser
}

export async function getUserByUsername(username: string): Promise<User | null> {
  return users.find((u) => u.username === username) || null
}

export async function validateUser(username: string, password: string): Promise<User | null> {
  const user = await getUserByUsername(username)
  if (!user) return null

  const isValid = await bcrypt.compare(password, user.password)
  return isValid ? user : null
}

// Game session functions
// Add some debug logging to the createGameSession function
export async function createGameSession(hostId: string): Promise<GameSession> {
  console.log(`Creating game session for host ID: ${hostId}`)

  const newSession: GameSession = {
    id: uuidv4(),
    hostId,
    gameState: "character-selection",
    currentPlayer: 1,
    players: [
      { id: 1, userId: hostId, name: "Player 1", character: null, position: 0, health: 100, energy: 100, items: [] },
      { id: 2, userId: null, name: "Player 2", character: null, position: 0, health: 100, energy: 100, items: [] },
    ],
    gameLog: [{ text: "Game created. Waiting for another player to join.", type: "system" }],
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "waiting",
  }

  gameSessions.push(newSession)
  gameHistory[newSession.id] = [{ ...newSession }] // Initialize history
  console.log(`Game session created with ID: ${newSession.id}`)
  return newSession
}

export async function joinGameSession(sessionId: string, userId: string): Promise<GameSession | null> {
  const session = gameSessions.find((s) => s.id === sessionId)
  if (!session || session.status !== "waiting") return null

  // Update session with guest
  session.guestId = userId
  session.players[1].userId = userId
  session.gameLog.push({ text: "Player 2 has joined the game.", type: "system" })
  session.updatedAt = new Date()

  // Save state to history
  gameHistory[session.id].push({ ...session })

  return session
}

export async function getGameSession(sessionId: string): Promise<GameSession | null> {
  return gameSessions.find((s) => s.id === sessionId) || null
}

export async function getGameSessionsByUser(userId: string): Promise<GameSession[]> {
  return gameSessions.filter((s) => s.hostId === userId || s.guestId === userId)
}

export async function updateGameSession(sessionId: string, updates: Partial<GameSession>): Promise<GameSession | null> {
  const sessionIndex = gameSessions.findIndex((s) => s.id === sessionId)
  if (sessionIndex === -1) return null

  // Update session
  const updatedSession = {
    ...gameSessions[sessionIndex],
    ...updates,
    updatedAt: new Date(),
  }

  gameSessions[sessionIndex] = updatedSession

  // Save state to history for redo functionality
  gameHistory[sessionId].push({ ...updatedSession })

  return updatedSession
}

// Redo functionality
export async function getPreviousGameState(sessionId: string): Promise<GameSession | null> {
  const history = gameHistory[sessionId]
  if (!history || history.length <= 1) return null

  // Remove current state
  history.pop()

  // Get previous state
  const previousState = history[history.length - 1]

  // Update current game session
  const sessionIndex = gameSessions.findIndex((s) => s.id === sessionId)
  if (sessionIndex !== -1) {
    gameSessions[sessionIndex] = { ...previousState }
  }

  return previousState
}

// Get all active game sessions for lobby
export async function getActiveGameSessions(): Promise<GameSession[]> {
  return gameSessions.filter((s) => s.status === "waiting")
}
