"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface LoginFormProps {
  onLogin: (user: { name: string; email: string }) => void
  language: "en" | "th"
}

export function LoginForm({ onLogin, language }: LoginFormProps) {
  const { t } = useTranslation(language)
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError(t("passwordsDoNotMatch") || "Passwords do not match")
        setLoading(false)
        return
      }
      const url = isLogin ? "/api/auth/login" : "/api/auth/register"
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password }
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t("error"))
        setLoading(false)
        return
      }
      if (isLogin) {
        // บันทึก token ใน localStorage
        if (data.token) {
          localStorage.setItem("token", data.token)
        }
        onLogin(data.user)
      } else {
        // สมัครสำเร็จ ให้สลับไปหน้า login
        setIsLogin(true)
        setError(null)
      }
    } catch (err) {
      setError(t("error") || "เกิดข้อผิดพลาด")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">{isLogin ? t("login") : t("register")}</CardTitle>
          <CardDescription>
            {isLogin ? "Welcome back to WorkoutPlanner" : "Create your WorkoutPlanner account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name">{t("fullName")}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email">{t("emailAddress")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">{t("password")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10"
                    placeholder="••••••••"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("loading") : isLogin ? t("signIn") : t("signUp")}
            </Button>
          </form>

          <Separator className="my-6" />

          <div className="text-center">
            <Button variant="link" onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-sm">
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
