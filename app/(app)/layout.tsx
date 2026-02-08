// app/(app)/layout.tsx
"use client"
import { Sidebar } from "@/components/sidebar"
import { useAuthStore } from "@/stores/auth-store"
import { useAppSettings } from "@/stores/app-settings-store"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    Home,
    Calendar,
    Dumbbell,
    BookOpen,
    BarChart3,
    Settings,
} from "lucide-react"

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuthStore()
    const language = useAppSettings((s) => s.language)
    const setLanguage = useAppSettings((s) => s.setLanguage)

    const router = useRouter()
    const pathname = usePathname()

    const mobileMenus = [
        { href: "/dashboard", icon: Home, label: "Dashboard" },
        { href: "/calendar", icon: Calendar, label: "Calendar" },
        { href: "/templates", icon: Dumbbell, label: "Templates" },
        { href: "/library", icon: BookOpen, label: "Library" },
        { href: "/progress", icon: BarChart3, label: "Progress" },
        { href: "/settings", icon: Settings, label: "Settings" },
    ]
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/")
        }
    }, [loading, user, router])
    console.log(loading || !user)
    if (loading || !user) return null

    return (
        <ThemeProvider defaultTheme="dark" storageKey="workout-planner-theme">
            <div className="flex h-screen bg-background">
                <div className="hidden md:block">
                    <Sidebar
                        language={language}
                        onLanguageChange={setLanguage}
                        user={user}
                        onLogout={logout}
                    />
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
                    <div className="flex justify-around py-2 px-2">
                        {mobileMenus.map((item) => {
                            const Icon = item.icon
                            const active = pathname.startsWith(item.href)

                            return (
                                <Button
                                    key={item.href}
                                    asChild
                                    variant={active ? "default" : "ghost"}
                                    size="sm"
                                    className="flex-col h-auto flex-1"
                                >
                                    <Link href={item.href}>
                                        <Icon className="h-4 w-4" />
                                        <span className="text-xs mt-1">{item.label}</span>
                                    </Link>
                                </Button>
                            )
                        })}
                    </div>
                </div>

                <main className="flex-1 overflow-auto pb-16 md:pb-0">
                    {/* Mobile Header - Fixed */}
                    <div className="md:hidden fixed top-0 left-0 right-0 bg-card border-b border-border p-4 z-50">
                        <Logo size={32} />
                    </div>
                    {/* Add padding to account for fixed header */}
                    <div className="md:hidden pt-16">
                        <div className="min-h-full">{children}</div>
                    </div>
                    {/* Desktop content */}
                    <div className="hidden md:block">
                        <div className="min-h-full">{children}</div>
                    </div>
                </main>
            </div>
            <Toaster />
        </ThemeProvider>
    )
}
