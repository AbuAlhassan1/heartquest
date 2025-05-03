"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  HeartIcon,
  SwordIcon,
  BookOpenIcon,
  StarIcon,
  ArrowLeftIcon,
  UserIcon,
  MapPinIcon,
  MessageSquareIcon,
  ZapIcon,
  RefreshCwIcon,
  HomeIcon,
} from "lucide-react"
import { GameBoard } from "../../game/game-board"
import { CharacterSelection } from "../../game/character-selection"
import { useMobile } from "@/hooks/use-mobile"
import { useI18n } from "@/lib/i18n/i18n-context"
import { useAuth } from "@/lib/auth/auth-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getGameSession, joinGame, updateGameState, redoTurn } from "./actions"
import type { GameSession } from "@/lib/auth/auth-types"

export default function GamePage({ params }: { params: { id: string } }) {
  const { t } = useI18n()
  const router = useRouter()
  const { authState } = useAuth()
  const isMobile = useMobile()

  const [gameSession, setGameSession] = useState<GameSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showConnectionCard, setShowConnectionCard] = useState(false)
  const [currentConnectionCard, setCurrentConnectionCard] = useState(null)
  const [isPolling, setIsPolling] = useState(false)

  // Determine if the current user is a player in this game
  const isHost = gameSession?.hostId === authState.user?.id
  const isGuest = gameSession?.guestId === authState.user?.id
  const isPlayer = isHost || isGuest
  const playerNumber = isHost ? 1 : isGuest ? 2 : 0
  const isMyTurn = gameSession?.currentPlayer === playerNumber

  // Load game data
  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push("/auth/login")
      return
    }

    const loadGame = async () => {
      try {
        setIsLoading(true)
        const game = await getGameSession(params.id)

        if (!game) {
          setError("Game not found")
        } else {
          setGameSession(game)

          // If the game is waiting and the user is not the host, try to join
          if (game.status === "waiting" && !isHost && !isGuest) {
            await joinGame(params.id)
            // Reload game data after joining
            const updatedGame = await getGameSession(params.id)
            if (updatedGame) {
              setGameSession(updatedGame)
            }
          }
        }
      } catch (error) {
        console.error("Failed to load game:", error)
        setError("Failed to load game")
      } finally {
        setIsLoading(false)
      }
    }

    loadGame()
  }, [authState.isAuthenticated, authState.user?.id, params.id, router, isHost, isGuest])

  // Set up polling for game updates
  useEffect(() => {
    if (!gameSession || !isPlayer) return

    // Only poll if the game is active and it's not your turn
    if (gameSession.status === "playing" && !isMyTurn) {
      setIsPolling(true)

      const pollInterval = setInterval(async () => {
        try {
          const updatedGame = await getGameSession(params.id)
          if (updatedGame) {
            setGameSession(updatedGame)

            // If it's now your turn, stop polling
            if ((isHost && updatedGame.currentPlayer === 1) || (isGuest && updatedGame.currentPlayer === 2)) {
              setIsPolling(false)
              clearInterval(pollInterval)
            }
          }
        } catch (error) {
          console.error("Polling error:", error)
        }
      }, 3000) // Poll every 3 seconds

      return () => {
        clearInterval(pollInterval)
        setIsPolling(false)
      }
    } else {
      setIsPolling(false)
    }
  }, [gameSession, isPlayer, isMyTurn, isHost, isGuest, params.id])

  // Game actions
  const startGame = async () => {
    if (!gameSession) return

    if (gameSession.players[0].character && gameSession.players[1].character) {
      try {
        const updatedGame = await updateGameState(gameSession.id, {
          gameState: "playing",
          status: "playing",
          gameLog: [...gameSession.gameLog, { text: t("adventureBegins"), type: "system" }],
        })

        if (updatedGame) {
          setGameSession(updatedGame)
        }
      } catch (error) {
        console.error("Failed to start game:", error)
      }
    } else {
      // Add error to game log
      const updatedGame = await updateGameState(gameSession.id, {
        gameLog: [...gameSession.gameLog, { text: t("bothPlayersSelect"), type: "error" }],
      })

      if (updatedGame) {
        setGameSession(updatedGame)
      }
    }
  }

  const selectCharacter = async (playerId: number, character: any) => {
    if (!gameSession) return

    // Update the player's character
    const updatedPlayers = gameSession.players.map((player) =>
      player.id === playerId ? { ...player, character } : player,
    )

    try {
      const updatedGame = await updateGameState(gameSession.id, {
        players: updatedPlayers,
        gameLog: [
          ...gameSession.gameLog,
          {
            text: t("playerSelectedCharacter", {
              player: `Player ${playerId}`,
              character: t(character.id),
            }),
            type: "action",
          },
        ],
      })

      if (updatedGame) {
        setGameSession(updatedGame)
      }
    } catch (error) {
      console.error("Failed to select character:", error)
    }
  }

  const endTurn = async () => {
    if (!gameSession) return

    // Switch to the other player
    const nextPlayer = gameSession.currentPlayer === 1 ? 2 : 1

    try {
      const updatedGame = await updateGameState(gameSession.id, {
        currentPlayer: nextPlayer,
        gameLog: [...gameSession.gameLog, { text: t("nowPlayerTurn", { number: nextPlayer }), type: "system" }],
      })

      if (updatedGame) {
        setGameSession(updatedGame)

        // 20% chance to trigger a connection card at the end of a turn
        if (Math.random() < 0.2) {
          triggerConnectionCard()
        }

        // Start polling for opponent's move
        setIsPolling(true)
      }
    } catch (error) {
      console.error("Failed to end turn:", error)
    }
  }

  const handleRedoTurn = async () => {
    if (!gameSession || !isMyTurn) return

    try {
      const previousState = await redoTurn(gameSession.id)
      if (previousState) {
        setGameSession(previousState)
      }
    } catch (error) {
      console.error("Failed to redo turn:", error)
    }
  }

  const triggerConnectionCard = () => {
    const connectionCards = [
      {
        id: 1,
        title: "sharedMemory",
        description: "sharedMemoryDesc",
        effect: async () => {
          if (!gameSession) return

          const updatedPlayers = gameSession.players.map((p) => ({
            ...p,
            energy: Math.min(p.energy + 10, 100),
          }))

          const updatedGame = await updateGameState(gameSession.id, {
            players: updatedPlayers,
            gameLog: [...gameSession.gameLog, { text: t("sharedMemoryLog"), type: "connection" }],
          })

          if (updatedGame) {
            setGameSession(updatedGame)
          }
        },
      },
      {
        id: 2,
        title: "gentleTouch",
        description: "gentleTouchDesc",
        effect: async () => {
          if (!gameSession) return

          const updatedPlayers = gameSession.players.map((p) => ({
            ...p,
            health: Math.min(p.health + 15, 100),
          }))

          const updatedGame = await updateGameState(gameSession.id, {
            players: updatedPlayers,
            gameLog: [...gameSession.gameLog, { text: t("gentleTouchLog"), type: "connection" }],
          })

          if (updatedGame) {
            setGameSession(updatedGame)
          }
        },
      },
      {
        id: 3,
        title: "compliment",
        description: "complimentDesc",
        effect: async () => {
          if (!gameSession) return

          const updatedGame = await updateGameState(gameSession.id, {
            gameLog: [...gameSession.gameLog, { text: t("complimentLog"), type: "connection" }],
          })

          if (updatedGame) {
            setGameSession(updatedGame)
          }
        },
      },
      {
        id: 4,
        title: "futureDreams",
        description: "futureDreamsDesc",
        effect: async () => {
          if (!gameSession) return

          const updatedPlayers = gameSession.players.map((p) => ({
            ...p,
            items: [...p.items, { name: "Dream Crystal", description: "Can be used to avoid one challenge" }],
          }))

          const updatedGame = await updateGameState(gameSession.id, {
            players: updatedPlayers,
            gameLog: [...gameSession.gameLog, { text: t("futureDreamsLog"), type: "connection" }],
          })

          if (updatedGame) {
            setGameSession(updatedGame)
          }
        },
      },
      {
        id: 5,
        title: "sweetGesture",
        description: "sweetGestureDesc",
        effect: async () => {
          if (!gameSession) return

          const updatedPlayers = gameSession.players.map((p) => ({
            ...p,
            energy: 100,
          }))

          const updatedGame = await updateGameState(gameSession.id, {
            players: updatedPlayers,
            gameLog: [...gameSession.gameLog, { text: t("sweetGestureLog"), type: "connection" }],
          })

          if (updatedGame) {
            setGameSession(updatedGame)
          }
        },
      },
    ]

    const randomCard = connectionCards[Math.floor(Math.random() * connectionCards.length)]
    setCurrentConnectionCard(randomCard)
    setShowConnectionCard(true)
  }

  const completeConnectionCard = async () => {
    if (currentConnectionCard && currentConnectionCard.effect) {
      await currentConnectionCard.effect()
    }
    setShowConnectionCard(false)
  }

  const movePlayer = async (playerId: number, steps: number) => {
    if (!gameSession) return

    const updatedPlayers = gameSession.players.map((player) =>
      player.id === playerId ? { ...player, position: Math.min(player.position + steps, 30) } : player,
    )

    try {
      const updatedGame = await updateGameState(gameSession.id, {
        players: updatedPlayers,
        gameLog: [...gameSession.gameLog, { text: t("playerMoved", { number: playerId, steps }), type: "action" }],
      })

      if (updatedGame) {
        setGameSession(updatedGame)

        // Check if any player has reached the end
        const movedPlayer = updatedPlayers.find((p) => p.id === playerId)
        if (movedPlayer && movedPlayer.position >= 30) {
          await updateGameState(gameSession.id, {
            gameState: "game-over",
            status: "completed",
            gameLog: [...updatedGame.gameLog, { text: t("congratsCompleted"), type: "system" }],
          }).then(setGameSession)
        }
      }
    } catch (error) {
      console.error("Failed to move player:", error)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900">
        <div className="text-center">
          <HeartIcon className="mx-auto mb-4 h-12 w-12 animate-pulse text-rose-600 dark:text-rose-400" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{t("loading")}</h2>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !gameSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900">
        <div className="max-w-md text-center">
          <HeartIcon className="mx-auto mb-4 h-12 w-12 text-rose-600 dark:text-rose-400" />
          <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">{t("error")}</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">{error || t("gameNotFound")}</p>
          <Link href="/dashboard">
            <Button className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600">
              <HomeIcon className="mr-2 h-4 w-4" />
              {t("backToDashboard")}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900">
      <div className="container mx-auto px-4 py-6">
        <div className="absolute right-4 top-4 rtl:left-4 rtl:right-auto">
          <LanguageSwitcher />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <ArrowLeftIcon className="h-4 w-4" />
              {t("backToDashboard")}
            </Button>
          </Link>

          {/* Game status indicator */}
          <div className="flex items-center gap-2">
            {isPolling && (
              <div className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
                {t("waitingForOpponent")}
              </div>
            )}

            {gameSession.status === "waiting" && (
              <div className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
                {t("waitingForPlayer")}
              </div>
            )}

            {gameSession.status === "playing" && (
              <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/50 dark:text-green-200">
                {t("inProgress")}
              </div>
            )}

            {gameSession.status === "completed" && (
              <div className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
                {t("completed")}
              </div>
            )}
          </div>
        </div>

        {gameSession.gameState === "character-selection" && (
          <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h1 className="mb-6 text-center text-3xl font-bold text-rose-800 dark:text-rose-200">
              {t("chooseYourCharacters")}
            </h1>

            {gameSession.status === "waiting" && !isHost && !isGuest ? (
              <div className="py-8 text-center">
                <p className="mb-4 text-gray-600 dark:text-gray-400">{t("waitingForHostToStart")}</p>
              </div>
            ) : (
              <>
                <CharacterSelection
                  players={gameSession.players}
                  onSelectCharacter={(playerId, character) => {
                    // Only allow selection if it's your player
                    if ((isHost && playerId === 1) || (isGuest && playerId === 2)) {
                      selectCharacter(playerId, character)
                    }
                  }}
                  currentUserPlayerNumber={playerNumber}
                />

                {isHost && (
                  <div className="mt-8 text-center">
                    <Button
                      size="lg"
                      className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
                      onClick={startGame}
                      disabled={gameSession.status === "waiting" && !gameSession.guestId}
                    >
                      {gameSession.status === "waiting" && !gameSession.guestId
                        ? t("waitingForPlayerToJoin")
                        : t("startAdventure")}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {gameSession.gameState === "playing" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Game Board - Takes 2/3 of the screen on desktop */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-rose-800 dark:text-rose-200">
                      {t("playerTurn", { number: gameSession.currentPlayer })}
                    </h2>

                    {isMyTurn && (
                      <Button variant="outline" size="sm" onClick={handleRedoTurn} className="flex items-center gap-1">
                        <RefreshCwIcon className="h-4 w-4" />
                        {t("redoTurn")}
                      </Button>
                    )}
                  </div>

                  <GameBoard
                    players={gameSession.players}
                    currentPlayer={gameSession.currentPlayer}
                    onMove={(steps) => {
                      // Only allow moves if it's your turn
                      if (isMyTurn) {
                        movePlayer(gameSession.currentPlayer, steps)
                      }
                    }}
                    isMyTurn={isMyTurn}
                  />

                  <div className="mt-4 flex justify-between">
                    <Button
                      variant="outline"
                      className="border-rose-600 text-rose-600 hover:bg-rose-100 dark:border-rose-400 dark:text-rose-400 dark:hover:bg-rose-950"
                      onClick={() => isMyTurn && triggerConnectionCard()}
                      disabled={!isMyTurn}
                    >
                      <HeartIcon className="mr-2 h-4 w-4" />
                      {t("connectionCard")}
                    </Button>

                    <Button
                      className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
                      onClick={endTurn}
                      disabled={!isMyTurn}
                    >
                      {t("endTurn")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Player Info and Game Log - Takes 1/3 of the screen on desktop */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4">
                  <Tabs defaultValue="players">
                    <TabsList className="w-full">
                      <TabsTrigger value="players" className="w-1/2">
                        <UserIcon className="mr-2 h-4 w-4" />
                        {t("players")}
                      </TabsTrigger>
                      <TabsTrigger value="log" className="w-1/2">
                        <BookOpenIcon className="mr-2 h-4 w-4" />
                        {t("gameLog")}
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="players" className="mt-4 space-y-4">
                      {gameSession.players.map((player) => (
                        <div
                          key={player.id}
                          className={`rounded-lg border p-3 ${
                            gameSession.currentPlayer === player.id
                              ? "border-rose-500 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/50"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{player.name}</h3>
                            {gameSession.currentPlayer === player.id && (
                              <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-medium text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                                {t("currentTurn")}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 text-sm">
                            <p className="flex items-center">
                              <SwordIcon className="mr-2 h-4 w-4 text-rose-600 dark:text-rose-400" />
                              {player.character ? t(player.character.id) : t("chooseYourCharacter")}
                            </p>
                            <p className="flex items-center">
                              <MapPinIcon className="mr-2 h-4 w-4 text-rose-600 dark:text-rose-400" />
                              {t("position")}: {player.position}/30
                            </p>
                            <div className="mt-2 space-y-1">
                              <div>
                                <div className="mb-1 flex items-center justify-between text-xs">
                                  <span>{t("health")}</span>
                                  <span>{player.health}/100</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                  <div
                                    className="h-full bg-red-500 dark:bg-red-600"
                                    style={{ width: `${player.health}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <div className="mb-1 flex items-center justify-between text-xs">
                                  <span>{t("energy")}</span>
                                  <span>{player.energy}/100</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                  <div
                                    className="h-full bg-blue-500 dark:bg-blue-600"
                                    style={{ width: `${player.energy}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {player.items.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium">{t("items")}:</p>
                              <ul className="mt-1 text-xs">
                                {player.items.map((item, idx) => (
                                  <li key={idx} className="flex items-center">
                                    <StarIcon className="mr-1 h-3 w-3 text-yellow-500" />
                                    {item.name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="log" className="mt-4 h-[300px] overflow-y-auto">
                      <div className="space-y-2">
                        {gameSession.gameLog.map((entry, idx) => (
                          <div
                            key={idx}
                            className={`rounded-lg p-2 text-sm ${
                              entry.type === "system"
                                ? "bg-gray-100 dark:bg-gray-700"
                                : entry.type === "error"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : entry.type === "connection"
                                    ? "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            }`}
                          >
                            {entry.type === "system" && <MessageSquareIcon className="mr-1 inline h-3 w-3" />}
                            {entry.type === "action" && <ZapIcon className="mr-1 inline h-3 w-3" />}
                            {entry.type === "connection" && <HeartIcon className="mr-1 inline h-3 w-3" />}
                            {entry.text}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {gameSession.gameState === "game-over" && (
          <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
            <h1 className="mb-6 text-3xl font-bold text-rose-800 dark:text-rose-200">{t("journeyComplete")}</h1>
            <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">{t("congratulations")}</p>
            <div className="mb-8 flex justify-center">
              <HeartIcon className="h-24 w-24 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="flex justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600">
                  {t("backToDashboard")}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Connection Card Dialog */}
      <Dialog open={showConnectionCard} onOpenChange={setShowConnectionCard}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-rose-800 dark:text-rose-200">{t("connectionMoment")}</DialogTitle>
            <DialogDescription className="text-center">{t("takeAMoment")}</DialogDescription>
          </DialogHeader>

          {currentConnectionCard && (
            <div className="space-y-4 p-4">
              <div className="flex justify-center">
                <HeartIcon className="h-16 w-16 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-center text-xl font-semibold text-gray-800 dark:text-gray-200">
                {t(currentConnectionCard.title)}
              </h3>
              <p className="text-center text-gray-700 dark:text-gray-300">{t(currentConnectionCard.description)}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              className="w-full bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
              onClick={completeConnectionCard}
            >
              {t("complete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
