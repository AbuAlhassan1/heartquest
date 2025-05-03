"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { HeartIcon } from "lucide-react"

interface ConnectionCard {
  id: number
  title: string
  description: string
  intimacyLevel: number // 1-3, where 3 is most intimate
  effect: string
}

interface ConnectionCardsProps {
  onSelectCard: (card: ConnectionCard) => void
}

export function ConnectionCards({ onSelectCard }: ConnectionCardsProps) {
  const [cards, setCards] = useState<ConnectionCard[]>([
    {
      id: 1,
      title: "Shared Memory",
      description: "Share a favorite memory you have together.",
      intimacyLevel: 1,
      effect: "Both players gain 10 energy.",
    },
    {
      id: 2,
      title: "Gentle Touch",
      description: "Hold hands for 10 seconds.",
      intimacyLevel: 2,
      effect: "Both players gain 15 health.",
    },
    {
      id: 3,
      title: "Compliment",
      description: "Give your partner a genuine compliment.",
      intimacyLevel: 1,
      effect: "Active player gains a bonus action.",
    },
    {
      id: 4,
      title: "Future Dreams",
      description: "Share something you're looking forward to doing together.",
      intimacyLevel: 2,
      effect: "Both players gain a special item.",
    },
    {
      id: 5,
      title: "Sweet Gesture",
      description: "Give your partner a small kiss.",
      intimacyLevel: 3,
      effect: "Both players fully restore their energy.",
    },
  ])

  // Get 3 random cards to display
  const getRandomCards = () => {
    const shuffled = [...cards].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3)
  }

  const randomCards = getRandomCards()

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Connection Cards</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Choose a card to create a moment of connection with your partner.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {randomCards.map((card) => (
          <Card
            key={card.id}
            className="cursor-pointer transition-all hover:border-rose-500 hover:shadow-md dark:hover:border-rose-400"
            onClick={() => onSelectCard(card)}
          >
            <CardContent className="p-4">
              <div className="mb-3 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900">
                  <HeartIcon className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                </div>
              </div>

              <h4 className="mb-2 text-center font-semibold text-gray-800 dark:text-gray-200">{card.title}</h4>

              <p className="mb-3 text-center text-sm text-gray-600 dark:text-gray-400">{card.description}</p>

              <div className="mb-2 flex justify-center">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <HeartIcon
                    key={idx}
                    className={`h-4 w-4 ${
                      idx < card.intimacyLevel ? "text-rose-600 dark:text-rose-400" : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>

              <div className="rounded-lg bg-gray-100 p-2 text-center text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                <strong>Effect:</strong> {card.effect}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
