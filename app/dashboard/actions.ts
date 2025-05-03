"use server"

import { cookies } from "next/headers"
import { createGameSession, getGameSessionsByUser, getActiveGameSessions } from "@/lib/db/db"
import type { GameSession } from "@/lib/auth/auth-types"

// Helper to get the current user ID from cookies
function getCurrentUserId(): string | null {
  const cookieStr = cookies().get("user")?.value

  if (!cookieStr) {
    // Fallback for development - check if we can access localStorage via headers
    // This is a workaround for the preview environment
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

export async function createNewGame(): Promise<GameSession | null> {
  const userId = getCurrentUserId()

  if (!userId) {
    console.error("User not authenticated - no user ID found in cookies")
    throw new Error("User not authenticated")
  }

  return await createGameSession(userId)
}

export async function getMyGames(): Promise<GameSession[]> {
  const userId = getCurrentUserId()
  if (!userId) {
    return []
  }

  return await getGameSessionsByUser(userId)
}

export async function getActiveGames(): Promise<GameSession[]> {
  return await getActiveGameSessions()
}
