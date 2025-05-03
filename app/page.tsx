"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeartIcon, SwordIcon, ShieldIcon, MapIcon } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useAuth } from "@/lib/auth/auth-context"

export default function HomePage() {
  const { t, dir } = useI18n()
  const { authState } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900">
      <div className="container mx-auto px-4 py-16">
        <div className="absolute right-4 top-4 rtl:left-4 rtl:right-auto">
          <LanguageSwitcher />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <HeartIcon className="h-16 w-16 text-rose-600 dark:text-rose-400" />
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-rose-800 dark:text-rose-200 sm:text-6xl">
            {t("appName")}
          </h1>
          <p className="mb-8 text-xl text-gray-700 dark:text-gray-300">{t("tagline")}</p>
          <div className="mb-12 flex flex-wrap justify-center gap-4">
            {authState.isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600">
                  {t("dashboard")}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button size="lg" className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600">
                    {t("login")}
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-rose-600 text-rose-600 hover:bg-rose-100 dark:border-rose-400 dark:text-rose-400 dark:hover:bg-rose-950"
                  >
                    {t("register")}
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <SwordIcon className="mx-auto mb-4 h-10 w-10 text-rose-600 dark:text-rose-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
                {t("strategicChallenges")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{t("strategicChallengesDesc")}</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <ShieldIcon className="mx-auto mb-4 h-10 w-10 text-rose-600 dark:text-rose-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">{t("cooperativePlay")}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t("cooperativePlayDesc")}</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <MapIcon className="mx-auto mb-4 h-10 w-10 text-rose-600 dark:text-rose-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">{t("romanticJourney")}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t("romanticJourneyDesc")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
