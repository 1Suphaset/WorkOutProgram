"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Logo } from "@/components/ui/logo"
import {
  Calendar,
  Dumbbell,
  Home,
  Settings,
  BookOpen,
  BarChart3,
  User,
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface SidebarProps {
  language: "en" | "th"
  onLanguageChange: (lang: "en" | "th") => void
  user?: { name: string; email: string } | null
  onLogout?: () => void
}

export function Sidebar({
  language,
  onLanguageChange,
  user,
}: SidebarProps) {
  const pathname = usePathname()
  const { t } = useTranslation(language)

  const menuItems = [
    { href: "/dashboard", label: t("dashboard"), icon: Home },
    { href: "/progress", label: t("progress"), icon: BarChart3 },
    { href: "/calendar", label: t("calendar"), icon: Calendar },
    { href: "/templates", label: t("templates"), icon: Dumbbell },
    { href: "/library", label: t("library"), icon: BookOpen },
    { href: "/settings", label: t("settings"), icon: Settings },
  ]

  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Logo size={32} />
        <p className="text-sm text-muted-foreground mt-2">
          Track your fitness
        </p>
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
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <Link href={item.href}>
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Link>
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            v3.5.0
          </Badge>
          <LanguageSwitcher
            language={language}
            onLanguageChange={onLanguageChange}
          />
        </div>
      </div>
    </div>
  )
}
