"use server"

import { cookies } from "next/headers"
import {
  getGameSession as getGameSessionFromDb,
  joinGameSession,
  updateGameSession,
  getPreviousGameState,
} from "@/lib/db/db"
import type { GameSession } from "@/lib/auth/auth-types"

// Helper to get the current user ID from cookies
function getCurrentUserId(): string | null {
  const cookieStr = cookies().get("user")?.value

  if (!cookieStr) {
    // Fallback for development - check if we can access localStorage via headers
    const headers = new Headers()
    const userFromHeaders = headers.get("x-user-id")
    if (userFromHeaders) {
      return userFromHeaders
    }
    return null
  }

  try {
    const user = JSON.parse(decodeURIComponent(cookieStr))
    return user.id
  } catch (error) {
    console.error("Failed to parse user cookie:", error)
    return null
  }
}

export async function getGameSession(id: string): Promise<GameSession | null> {
  return await getGameSessionFromDb(id)
}

export async function joinGame(gameId: string): Promise<GameSession | null> {
  const userId = getCurrentUserId()
  if (!userId) {
    throw new Error("User not authenticated")
  }

  return await joinGameSession(gameId, userId)
}

export async function updateGameState(gameId: string, updates: Partial<GameSession>): Promise<GameSession | null> {
  return await updateGameSession(gameId, updates)
}

export async function redoTurn(gameId: string): Promise<GameSession | null> {
  return await getPreviousGameState(gameId)
}
