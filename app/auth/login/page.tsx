"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { HeartIcon, AlertCircleIcon } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"
import { useAuth } from "@/lib/auth/auth-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { loginUser } from "@/app/auth/actions"

export default function LoginPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { login } = useAuth()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await loginUser(username, password)

      if (result.error) {
        setError(result.error)
      } else if (result.user) {
        login(result.user)
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900">
      <div className="container mx-auto px-4 py-16">
        <div className="absolute right-4 top-4 rtl:left-4 rtl:right-auto">
          <LanguageSwitcher />
        </div>

        <div className="mx-auto max-w-md">
          <div className="mb-6 flex justify-center">
            <HeartIcon className="h-16 w-16 text-rose-600 dark:text-rose-400" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">{t("login")}</CardTitle>
              <CardDescription className="text-center">{t("welcomeBack")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-800 dark:bg-red-900/50 dark:text-red-200">
                    <AlertCircleIcon className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="mb-4 grid gap-2">
                  <Label htmlFor="username">{t("username")}</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>

                <div className="mb-6 grid gap-2">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
                  disabled={isLoading}
                >
                  {isLoading ? t("loggingIn") : t("login")}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("dontHaveAccount")}{" "}
                <Link href="/auth/register" className="text-rose-600 hover:underline dark:text-rose-400">
                  {t("register")}
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
