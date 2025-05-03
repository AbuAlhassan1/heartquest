export interface User {
  id: string
  username: string
  password: string // This will be hashed
  createdAt: Date
}

export interface GameSession {
  id: string
  hostId: string
  guestId?: string
  gameState: string
  currentPlayer: number
  players: any[]
  gameLog: any[]
  createdAt: Date
  updatedAt: Date
  status: "waiting" | "playing" | "completed"
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}
