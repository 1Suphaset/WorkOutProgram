// stores/app-settings-store.ts
import { create } from "zustand"

export type Language = "en" | "th"
export type ThemeMode = "light" | "dark" | "system"

interface AppSettingsState {
    language: Language
    theme: ThemeMode

    setLanguage: (lang: Language) => void
    setTheme: (theme: ThemeMode) => void
    hydrate: () => void
}

export const useAppSettings = create<AppSettingsState>((set) => ({
    language: "en",
    theme: "system",

    setLanguage: (language) => {
        localStorage.setItem("app_language", language)
        set({ language })
    },

    setTheme: (theme) => {
        localStorage.setItem("app_theme", theme)
        set({ theme })
    },

    hydrate: () => {
        const language = (localStorage.getItem("app_language") as Language) || "en"
        const theme = (localStorage.getItem("app_theme") as ThemeMode) || "system"

        set({ language, theme })
    },
}))
