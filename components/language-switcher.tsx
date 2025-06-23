"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

interface LanguageSwitcherProps {
  language: "en" | "th"
  onLanguageChange: (lang: "en" | "th") => void
}

export function LanguageSwitcher({ language, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onLanguageChange(language === "en" ? "th" : "en")}
      className="flex items-center space-x-2"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">{language === "en" ? "ไทย" : "EN"}</span>
    </Button>
  )
}
