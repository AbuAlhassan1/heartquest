"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HeartIcon, PlusIcon, LogOutIcon, UsersIcon } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"
import { useAuth } from "@/lib/auth/auth-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { createNewGame, getMyGames, getActiveGames } from "./actions"
import type { GameSession } from "@/lib/auth/auth-types"

export default function DashboardPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { authState, logout } = useAuth()

  const [myGames, setMyGames] = useState<GameSession[]>([])
  const [activeGames, setActiveGames] = useState<GameSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Redirect if not authenticated
    if (!authState.isAuthenticated) {
      router.push("/auth/login")
      return
    }

    // Load games
    const loadGames = async () => {
      try {
        const [userGames, publicGames] = await Promise.all([getMyGames(), getActiveGames()])

        setMyGames(userGames)
        // Filter out games created by the current user
        setActiveGames(publicGames.filter((game) => game.hostId !== authState.user?.id))
      } catch (error) {
        console.error("Failed to load games:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadGames()
  }, [authState.isAuthenticated, authState.user?.id, router])

  // Update the handleCreateGame function to include error handling
  const handleCreateGame = async () => {
    try {
      // Pass the user ID directly as a fallback
      const game = await createNewGame()
      if (game) {
        router.push(`/game/${game.id}`)
      }
    } catch (error) {
      console.error("Failed to create game:", error)
      // Show an error message to the user
      alert("Failed to create game. Please try logging in again.")
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Add this useEffect to set a header with the user ID for server actions
  useEffect(() => {
    if (authState.user?.id) {
      // This is a workaround for development/preview environments
      const headers = new Headers()
      headers.set("x-user-id", authState.user.id)
    }
  }, [authState.user?.id])

  if (!authState.isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900">
      <div className="container mx-auto px-4 py-8">
        <div className="absolute right-4 top-4 rtl:left-4 rtl:right-auto">
          <LanguageSwitcher />
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HeartIcon className="h-8 w-8 text-rose-600 dark:text-rose-400" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t("dashboard")}</h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">
              {t("loggedInAs")} <strong>{authState.user?.username}</strong>
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOutIcon className="h-5 w-5" />
              <span className="sr-only">{t("logout")}</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* My Games */}
          <Card>
            <CardHeader>
              <CardTitle>{t("myGames")}</CardTitle>
              <CardDescription>{t("gamesYouCreatedOrJoined")}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">{t("loading")}</div>
              ) : myGames.length === 0 ? (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">{t("noGamesYet")}</div>
              ) : (
                <div className="space-y-3">
                  {myGames.map((game) => (
                    <Link key={game.id} href={`/game/${game.id}`}>
                      <div className="flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-gray-200">
                            {t("gameWithId", { id: game.id.substring(0, 8) })}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {game.status === "waiting"
                              ? t("waitingForPlayer")
                              : game.status === "playing"
                                ? t("inProgress")
                                : t("completed")}
                          </p>
                        </div>
                        <div className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                          {game.hostId === authState.user?.id ? t("host") : t("guest")}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
                onClick={handleCreateGame}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                {t("createNewGame")}
              </Button>
            </CardFooter>
          </Card>

          {/* Available Games */}
          <Card>
            <CardHeader>
              <CardTitle>{t("availableGames")}</CardTitle>
              <CardDescription>{t("joinExistingGame")}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">{t("loading")}</div>
              ) : activeGames.length === 0 ? (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">{t("noAvailableGames")}</div>
              ) : (
                <div className="space-y-3">
                  {activeGames.map((game) => (
                    <Link key={game.id} href={`/game/${game.id}`}>
                      <div className="flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-gray-200">
                            {t("hostedBy", { host: game.players[0].name })}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t("createdAt", { time: new Date(game.createdAt).toLocaleString() })}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
                        >
                          {t("join")}
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full">
                  <UsersIcon className="mr-2 h-4 w-4" />
                  {t("backToHome")}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
