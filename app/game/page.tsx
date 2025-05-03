"use client"

import { useState } from "react"
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
} from "lucide-react"
import { GameBoard } from "./game-board"
import { CharacterSelection } from "./character-selection"
import { useMobile } from "@/hooks/use-mobile"
import { useI18n } from "@/lib/i18n/i18n-context"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function GamePage() {
  const { t, dir } = useI18n()
  const isMobile = useMobile()
  const [gameState, setGameState] = useState("character-selection") // character-selection, playing, game-over
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [players, setPlayers] = useState([
    { id: 1, name: "Player 1", character: null, position: 0, health: 100, energy: 100, items: [] },
    { id: 2, name: "Player 2", character: null, position: 0, health: 100, energy: 100, items: [] },
  ])
  const [showConnectionCard, setShowConnectionCard] = useState(false)
  const [currentConnectionCard, setCurrentConnectionCard] = useState(null)
  const [gameLog, setGameLog] = useState([{ text: t("welcomeMessage"), type: "system" }])

  const startGame = () => {
    if (players[0].character && players[1].character) {
      setGameState("playing")
      addToGameLog(t("adventureBegins"), "system")
    } else {
      addToGameLog(t("bothPlayersSelect"), "error")
    }
  }

  const selectCharacter = (playerId, character) => {
    setPlayers(players.map((player) => (player.id === playerId ? { ...player, character } : player)))
    addToGameLog(t("playerSelectedCharacter", { player: `Player ${playerId}`, character: t(character.id) }), "action")
  }

  const endTurn = () => {
    // Switch to the other player
    const nextPlayer = currentPlayer === 1 ? 2 : 1
    setCurrentPlayer(nextPlayer)
    addToGameLog(t("nowPlayerTurn", { number: nextPlayer }), "system")

    // 20% chance to trigger a connection card at the end of a turn
    if (Math.random() < 0.2) {
      triggerConnectionCard()
    }
  }

  const triggerConnectionCard = () => {
    const connectionCards = [
      {
        id: 1,
        title: "sharedMemory",
        description: "sharedMemoryDesc",
        effect: () => {
          setPlayers(players.map((p) => ({ ...p, energy: Math.min(p.energy + 10, 100) })))
          addToGameLog(t("sharedMemoryLog"), "connection")
        },
      },
      {
        id: 2,
        title: "gentleTouch",
        description: "gentleTouchDesc",
        effect: () => {
          setPlayers(players.map((p) => ({ ...p, health: Math.min(p.health + 15, 100) })))
          addToGameLog(t("gentleTouchLog"), "connection")
        },
      },
      {
        id: 3,
        title: "compliment",
        description: "complimentDesc",
        effect: () => {
          addToGameLog(t("complimentLog"), "connection")
        },
      },
      {
        id: 4,
        title: "futureDreams",
        description: "futureDreamsDesc",
        effect: () => {
          setPlayers(
            players.map((p) => ({
              ...p,
              items: [...p.items, { name: "Dream Crystal", description: "Can be used to avoid one challenge" }],
            })),
          )
          addToGameLog(t("futureDreamsLog"), "connection")
        },
      },
      {
        id: 5,
        title: "sweetGesture",
        description: "sweetGestureDesc",
        effect: () => {
          setPlayers(players.map((p) => ({ ...p, energy: 100 })))
          addToGameLog(t("sweetGestureLog"), "connection")
        },
      },
    ]

    const randomCard = connectionCards[Math.floor(Math.random() * connectionCards.length)]
    setCurrentConnectionCard(randomCard)
    setShowConnectionCard(true)
  }

  const completeConnectionCard = () => {
    if (currentConnectionCard && currentConnectionCard.effect) {
      currentConnectionCard.effect()
    }
    setShowConnectionCard(false)
  }

  const addToGameLog = (text, type = "action") => {
    setGameLog((prev) => [...prev, { text, type, timestamp: new Date().toISOString() }])
  }

  const movePlayer = (playerId, steps) => {
    setPlayers(
      players.map((player) =>
        player.id === playerId ? { ...player, position: Math.min(player.position + steps, 30) } : player,
      ),
    )
    addToGameLog(t("playerMoved", { number: playerId, steps }), "action")

    // Check if any player has reached the end
    const updatedPlayer = players.find((p) => p.id === playerId)
    if (updatedPlayer.position + steps >= 30) {
      setGameState("game-over")
      addToGameLog(t("congratsCompleted"), "system")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900">
      <div className="container mx-auto px-4 py-6">
        <div className="absolute right-4 top-4 rtl:left-4 rtl:right-auto">
          <LanguageSwitcher />
        </div>

        <Link href="/">
          <Button variant="ghost" className="mb-4 flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <ArrowLeftIcon className="h-4 w-4" />
            {t("backToHome")}
          </Button>
        </Link>

        {gameState === "character-selection" && (
          <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h1 className="mb-6 text-center text-3xl font-bold text-rose-800 dark:text-rose-200">
              {t("chooseYourCharacters")}
            </h1>
            <CharacterSelection players={players} onSelectCharacter={selectCharacter} />
            <div className="mt-8 text-center">
              <Button
                size="lg"
                className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
                onClick={startGame}
              >
                {t("startAdventure")}
              </Button>
            </div>
          </div>
        )}

        {gameState === "playing" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Game Board - Takes 2/3 of the screen on desktop */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardContent className="p-6">
                  <h2 className="mb-4 text-2xl font-bold text-rose-800 dark:text-rose-200">
                    {t("playerTurn", { number: currentPlayer })}
                  </h2>
                  <GameBoard
                    players={players}
                    currentPlayer={currentPlayer}
                    onMove={(steps) => movePlayer(currentPlayer, steps)}
                  />
                  <div className="mt-4 flex justify-between">
                    <Button
                      variant="outline"
                      className="border-rose-600 text-rose-600 hover:bg-rose-100 dark:border-rose-400 dark:text-rose-400 dark:hover:bg-rose-950"
                      onClick={() => triggerConnectionCard()}
                    >
                      <HeartIcon className="mr-2 h-4 w-4" />
                      {t("connectionCard")}
                    </Button>
                    <Button
                      className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
                      onClick={endTurn}
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
                      {players.map((player) => (
                        <div
                          key={player.id}
                          className={`rounded-lg border p-3 ${
                            currentPlayer === player.id
                              ? "border-rose-500 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/50"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{player.name}</h3>
                            {currentPlayer === player.id && (
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
                        {gameLog.map((entry, idx) => (
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

        {gameState === "game-over" && (
          <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
            <h1 className="mb-6 text-3xl font-bold text-rose-800 dark:text-rose-200">{t("journeyComplete")}</h1>
            <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">{t("congratulations")}</p>
            <div className="mb-8 flex justify-center">
              <HeartIcon className="h-24 w-24 text-rose-600 dark:text-rose-400" />
            </div>
            <Link href="/">
              <Button size="lg" className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600">
                {t("returnHome")}
              </Button>
            </Link>
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
