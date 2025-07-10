"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Logo } from "@/components/ui/logo"
import { Calendar, Dumbbell, Home, Settings, BookOpen, BarChart3, Timer, User, LogOut } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
  language: "en" | "th"
  onLanguageChange: (lang: "en" | "th") => void
  user?: { name: string; email: string } | null
  onLogout?: () => void
}

export function Sidebar({ activeView, setActiveView, language, onLanguageChange, user, onLogout }: SidebarProps) {
  const { t } = useTranslation(language)

  const menuItems = [
    { id: "dashboard", label: t("dashboard"), icon: Home },
    { id: "calendar", label: t("calendar"), icon: Calendar },
    { id: "templates", label: t("templates"), icon: Dumbbell },
    { id: "library", label: t("library"), icon: BookOpen },
    { id: "progress", label: t("progress"), icon: BarChart3 },
    { id: "settings", label: t("settings"), icon: Settings },
  ]

  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <Logo size={32} />
        <p className="text-sm text-muted-foreground mt-2">Track your fitness</p>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {t("welcomeUser")} {user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveView(item.id)}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            v3.0.0
          </Badge>
          <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
        </div>

        {user && onLogout && (
          <Button variant="outline" size="sm" onClick={onLogout} className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            {t("logout")}
          </Button>
        )}
      </div>
    </div>
  )
}
