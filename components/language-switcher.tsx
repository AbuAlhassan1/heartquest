"use client"

import { useI18n } from "@/lib/i18n/i18n-context"
import { Button } from "@/components/ui/button"
import { GlobeIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function LanguageSwitcher() {
  const { language, changeLanguage, t } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <GlobeIcon className="h-5 w-5" />
          <span className="sr-only">{t("language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")} className={language === "en" ? "bg-muted" : ""}>
          {t("english")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("ar")} className={language === "ar" ? "bg-muted" : ""}>
          {t("arabic")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
