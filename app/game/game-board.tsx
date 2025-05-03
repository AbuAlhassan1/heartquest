"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dice1Icon as DiceIcon } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"

interface GameBoardProps {
  players: any[]
  currentPlayer: number
  onMove: (steps: number) => void
  isMyTurn?: boolean
}

export function GameBoard({ players, currentPlayer, onMove, isMyTurn = true }: GameBoardProps) {
  const { t, dir } = useI18n()
  const [diceRoll, setDiceRoll] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState(false)

  // Game board has 30 spaces total
  const totalSpaces = 30

  const rollDice = () => {
    if (!isMyTurn) return

    setIsRolling(true)

    // Animate dice roll
    let rollCount = 0
    const maxRolls = 10
    const rollInterval = setInterval(() => {
      setDiceRoll(Math.floor(Math.random() * 6) + 1)
      rollCount++

      if (rollCount >= maxRolls) {
        clearInterval(rollInterval)
        const finalRoll = Math.floor(Math.random() * 6) + 1
        setDiceRoll(finalRoll)
        setIsRolling(false)
        onMove(finalRoll)
      }
    }, 100)
  }

  // Create the game board spaces
  const boardSpaces = Array.from({ length: totalSpaces }, (_, i) => i + 1)

  // Special spaces with events
  const specialSpaces = {
    5: { type: "challenge", description: "puzzleChallenge" },
    10: { type: "reward", description: "treasureChest" },
    15: { type: "challenge", description: "monsterEncounter" },
    20: { type: "reward", description: "healingSpring" },
    25: { type: "challenge", description: "finalBoss" },
  }

  // Get player positions
  const playerPositions = players.reduce((acc, player) => {
    acc[player.position] = [...(acc[player.position] || []), player.id]
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{t("gameBoard")}</h3>
        <div className="flex items-center gap-4">
          <div className="text-center">
            {diceRoll !== null && (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-2xl font-bold shadow-md dark:bg-gray-700">
                {diceRoll}
              </div>
            )}
          </div>
          <Button
            onClick={rollDice}
            disabled={isRolling || !isMyTurn}
            className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
          >
            <DiceIcon className="mr-2 h-4 w-4" />
            {t("rollDice")}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-[800px] flex-wrap gap-2 p-2">
          {boardSpaces.map((space) => {
            const isSpecial = space in specialSpaces
            const playersHere = playerPositions[space] || []

            return (
              <div
                key={space}
                className={`
                  relative flex h-16 w-16 items-center justify-center rounded-lg border-2 
                  ${
                    isSpecial
                      ? specialSpaces[space].type === "challenge"
                        ? "border-orange-500 bg-orange-100 dark:border-orange-700 dark:bg-orange-950/50"
                        : "border-green-500 bg-green-100 dark:border-green-700 dark:bg-green-950/50"
                      : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
                  }
                `}
              >
                <span className="text-sm font-medium">{space}</span>

                {/* Show special space indicator */}
                {isSpecial && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-center text-[8px] text-white">
                    {t(specialSpaces[space].description)}
                  </div>
                )}

                {/* Show players on this space */}
                {playersHere.length > 0 && (
                  <div className="absolute -top-2 flex gap-1">
                    {playersHere.map((playerId) => (
                      <div
                        key={playerId}
                        className={`
                          h-5 w-5 rounded-full text-[10px] font-bold text-white
                          ${playerId === 1 ? "bg-blue-500" : "bg-pink-500"}
                        `}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        P{playerId}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
        <h4 className="mb-2 font-semibold text-gray-800 dark:text-gray-200">{t("legend")}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"></div>
            <span>{t("normalSpace")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border-2 border-orange-500 bg-orange-100 dark:border-orange-700 dark:bg-orange-950/50"></div>
            <span>{t("challenge")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border-2 border-green-500 bg-green-100 dark:border-green-700 dark:bg-green-950/50"></div>
            <span>{t("reward")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
