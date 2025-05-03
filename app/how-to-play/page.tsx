"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function HowToPlayPage() {
  const { t, dir } = useI18n()

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900">
      <div className="container mx-auto px-4 py-12">
        <div className="absolute right-4 top-4 rtl:left-4 rtl:right-auto">
          <LanguageSwitcher />
        </div>

        <Link href="/">
          <Button variant="ghost" className="mb-6 flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <ArrowLeftIcon className="h-4 w-4" />
            {t("backToHome")}
          </Button>
        </Link>

        <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <h1 className="mb-6 text-center text-3xl font-bold text-rose-800 dark:text-rose-200">
            {t("howToPlayTitle")}
          </h1>

          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-gray-200">{t("gameOverview")}</h2>
              <p className="text-gray-700 dark:text-gray-300">{t("gameOverviewDesc")}</p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-gray-200">{t("gettingStarted")}</h2>
              <ol className="ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300">
                {t("gettingStartedSteps").map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-gray-200">{t("turnStructure")}</h2>
              <p className="mb-3 text-gray-700 dark:text-gray-300">{t("turnStructureDesc")}</p>
              <ul className="ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>{t("movementPhase")}:</strong> {t("movementPhaseDesc")}
                </li>
                <li>
                  <strong>{t("actionPhase")}:</strong> {t("actionPhaseDesc")}
                </li>
                <li>
                  <strong>{t("connectionPhase")}:</strong> {t("connectionPhaseDesc")}
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-gray-200">{t("connectionCards")}</h2>
              <p className="text-gray-700 dark:text-gray-300">{t("connectionCardsDesc")}</p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-gray-200">{t("winningTogether")}</h2>
              <p className="text-gray-700 dark:text-gray-300">{t("winningTogetherDesc")}</p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link href="/game">
              <Button size="lg" className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600">
                {t("startYourAdventure")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
