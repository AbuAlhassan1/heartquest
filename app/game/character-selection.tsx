"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SwordIcon, ShieldIcon, WandIcon, HeartIcon, ZapIcon, BookOpenIcon } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"

interface Character {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  abilities: string[]
  stats: {
    strength: number
    defense: number
    magic: number
    charm: number
  }
}

interface CharacterSelectionProps {
  players: any[]
  onSelectCharacter: (playerId: number, character: Character) => void
  currentUserPlayerNumber?: number
}

export function CharacterSelection({
  players,
  onSelectCharacter,
  currentUserPlayerNumber = 0,
}: CharacterSelectionProps) {
  const { t, dir } = useI18n()
  const [selectedCharacters, setSelectedCharacters] = useState<Record<number, string>>({})

  const characters: Character[] = [
    {
      id: "warrior",
      name: "warrior",
      description: "warriorDesc",
      icon: <SwordIcon className="h-8 w-8 text-rose-600 dark:text-rose-400" />,
      abilities: ["warriorAbilities.0", "warriorAbilities.1", "warriorAbilities.2"],
      stats: {
        strength: 9,
        defense: 7,
        magic: 3,
        charm: 5,
      },
    },
    {
      id: "guardian",
      name: "guardian",
      description: "guardianDesc",
      icon: <ShieldIcon className="h-8 w-8 text-rose-600 dark:text-rose-400" />,
      abilities: ["guardianAbilities.0", "guardianAbilities.1", "guardianAbilities.2"],
      stats: {
        strength: 6,
        defense: 9,
        magic: 4,
        charm: 6,
      },
    },
    {
      id: "mage",
      name: "mage",
      description: "mageDesc",
      icon: <WandIcon className="h-8 w-8 text-rose-600 dark:text-rose-400" />,
      abilities: ["mageAbilities.0", "mageAbilities.1", "mageAbilities.2"],
      stats: {
        strength: 3,
        defense: 4,
        magic: 9,
        charm: 7,
      },
    },
    {
      id: "empath",
      name: "empath",
      description: "empathDesc",
      icon: <HeartIcon className="h-8 w-8 text-rose-600 dark:text-rose-400" />,
      abilities: ["empathAbilities.0", "empathAbilities.1", "empathAbilities.2"],
      stats: {
        strength: 4,
        defense: 5,
        magic: 7,
        charm: 9,
      },
    },
    {
      id: "trickster",
      name: "trickster",
      description: "tricksterDesc",
      icon: <ZapIcon className="h-8 w-8 text-rose-600 dark:text-rose-400" />,
      abilities: ["tricksterAbilities.0", "tricksterAbilities.1", "tricksterAbilities.2"],
      stats: {
        strength: 5,
        defense: 5,
        magic: 6,
        charm: 8,
      },
    },
    {
      id: "sage",
      name: "sage",
      description: "sageDesc",
      icon: <BookOpenIcon className="h-8 w-8 text-rose-600 dark:text-rose-400" />,
      abilities: ["sageAbilities.0", "sageAbilities.1", "sageAbilities.2"],
      stats: {
        strength: 4,
        defense: 6,
        magic: 8,
        charm: 7,
      },
    },
  ]

  // Initialize selected characters from players
  useState(() => {
    const initialSelected = {}
    players.forEach((player) => {
      if (player.character) {
        initialSelected[player.id] = player.character.id
      }
    })
    setSelectedCharacters(initialSelected)
  })

  const handleSelectCharacter = (playerId: number, characterId: string) => {
    // Check if this player can select (based on currentUserPlayerNumber)
    if (currentUserPlayerNumber !== 0 && currentUserPlayerNumber !== playerId) {
      return
    }

    const character = characters.find((c) => c.id === characterId)
    if (character) {
      setSelectedCharacters({
        ...selectedCharacters,
        [playerId]: characterId,
      })
      onSelectCharacter(playerId, character)
    }
  }

  const isCharacterSelected = (characterId: string) => {
    return Object.values(selectedCharacters).includes(characterId)
  }

  const getPlayerForCharacter = (characterId: string) => {
    for (const [playerId, charId] of Object.entries(selectedCharacters)) {
      if (charId === characterId) {
        return `Player ${playerId}`
      }
    }
    return null
  }

  return (
    <div className="space-y-8">
      {players.map((player) => {
        // Only show character selection for the current user's player number
        const canSelect = currentUserPlayerNumber === 0 || currentUserPlayerNumber === player.id

        return (
          <div key={player.id} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {player.name}, {t("chooseYourCharacter")}
              {!canSelect && <span className="ml-2 text-sm text-gray-500">({t("waitingForPlayerToSelect")})</span>}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {characters.map((character) => {
                const isSelected = selectedCharacters[player.id] === character.id
                const isDisabled = (isCharacterSelected(character.id) && !isSelected) || !canSelect
                const selectedBy = getPlayerForCharacter(character.id)

                return (
                  <Card
                    key={character.id}
                    className={`
                      transition-all hover:shadow-md
                      ${isSelected ? "border-2 border-rose-500 dark:border-rose-400" : ""}
                      ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                    `}
                    onClick={() => !isDisabled && handleSelectCharacter(player.id, character.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900">
                            {character.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">{t(character.name)}</h3>
                            {isDisabled && selectedBy && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {t("selectedBy", { player: selectedBy })}
                              </p>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="rounded-full bg-rose-100 px-2 py-1 text-xs font-medium text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                            {t("selected")}
                          </div>
                        )}
                      </div>

                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{t(character.description)}</p>

                      <div className="mt-3">
                        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">{t("abilities")}:</h4>
                        <ul className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          {character.abilities.map((ability, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <div className="h-1 w-1 rounded-full bg-rose-500 dark:bg-rose-400"></div>
                              {t(ability)}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div>
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span>{t("strength")}</span>
                            <span>{character.stats.strength}/10</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-full bg-red-500 dark:bg-red-600"
                              style={{ width: `${character.stats.strength * 10}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span>{t("defense")}</span>
                            <span>{character.stats.defense}/10</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-full bg-blue-500 dark:bg-blue-600"
                              style={{ width: `${character.stats.defense * 10}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span>{t("magic")}</span>
                            <span>{character.stats.magic}/10</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-full bg-purple-500 dark:bg-purple-600"
                              style={{ width: `${character.stats.magic * 10}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span>{t("charm")}</span>
                            <span>{character.stats.charm}/10</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-full bg-pink-500 dark:bg-pink-600"
                              style={{ width: `${character.stats.charm * 10}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
