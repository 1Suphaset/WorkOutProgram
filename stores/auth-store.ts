// stores/auth-store.ts
import { create } from "zustand"
import { jwtDecode } from "jwt-decode"

interface User {
    name: string
    email: string
}

interface DecodedToken {
    exp?: number
    name?: string
    email?: string
}

interface AuthState {
    user: User | null
    token: string | null
    loading: boolean

    login: (data: { email: string; password: string }) => Promise<boolean>
    logout: () => void
    hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    loading: true,

    login: async ({ email, password }) => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })

        if (!res.ok) return false

        const data = await res.json()
        localStorage.setItem("token", data.token)

        set({ token: data.token })
        await useAuthStore.getState().hydrate()

        return true
    },

    hydrate: async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            set({ user: null, token: null, loading: false })
            return
        }

        try {
            const decoded = jwtDecode<DecodedToken>(token)

            if (decoded.exp && Date.now() >= decoded.exp * 1000) {
                localStorage.removeItem("token")
                set({ user: null, token: null, loading: false })
                return
            }

            // พยายามดึง user จาก API (source of truth)
            try {
                const res = await fetch("/api/user", {
                    headers: { Authorization: `Bearer ${token}` },
                })

                if (res.ok) {
                    const data = await res.json()
                    set({
                        user: { name: data.user.name, email: data.user.email },
                        token,
                        loading: false,
                    })
                    return
                }
            } catch { }

            // fallback จาก token
            set({
                user: {
                    name: decoded.name ?? "",
                    email: decoded.email ?? "",
                },
                token,
                loading: false,
            })
        } catch {
            localStorage.removeItem("token")
            set({ user: null, token: null, loading: false })
        }
    },

    logout: () => {
        localStorage.removeItem("token")
        set({ user: null, token: null })
    },
}))
