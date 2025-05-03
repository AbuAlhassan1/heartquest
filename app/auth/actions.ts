"use server"

import { createUser, validateUser } from "@/lib/db/db"
import { cookies } from "next/headers"

export async function registerUser(username: string, password: string) {
  try {
    if (!username || !password) {
      return { error: "Username and password are required" }
    }

    if (username.length < 3) {
      return { error: "Username must be at least 3 characters" }
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters" }
    }

    const user = await createUser(username, password)

    if (!user) {
      return { error: "Username already exists" }
    }

    // Don't return the password hash
    const { password: _, ...safeUser } = user

    // Set a cookie for server-side authentication
    cookies().set({
      name: "user",
      value: JSON.stringify(safeUser),
      httpOnly: false, // Allow JavaScript access
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "strict",
    })

    return { user: safeUser }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Failed to register user" }
  }
}

export async function loginUser(username: string, password: string) {
  try {
    if (!username || !password) {
      return { error: "Username and password are required" }
    }

    const user = await validateUser(username, password)

    if (!user) {
      return { error: "Invalid username or password" }
    }

    // Don't return the password hash
    const { password: _, ...safeUser } = user

    // Set a cookie for server-side authentication
    cookies().set({
      name: "user",
      value: JSON.stringify(safeUser),
      httpOnly: false, // Allow JavaScript access
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "strict",
    })

    return { user: safeUser }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "Failed to log in" }
  }
}
