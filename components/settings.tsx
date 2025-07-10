"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { SettingsIcon, User, Bell, Download, Upload, Trash2, ExternalLink, LogOut } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { ProfileForm, PasswordForm } from "@/components/user-profile"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

export function Settings({ language, userEmail, user, onLogout }: { language: "en" | "th", userEmail?: string, user?: { name: string; email: string } | null, onLogout?: () => void }) {
  const { t } = useTranslation(language)
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    notifications: true,
    reminderTime: "09:00",
    units: "metric",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userEmail) return
    setLoading(true)
    fetch(`/api/settings?user=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => {
        if (data.settings) setSettings(data.settings)
      })
      .finally(() => setLoading(false))
  }, [userEmail])

  const saveSettings = async () => {
    if (!userEmail) return
    setLoading(true)
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, userEmail, createdAt: new Date().toISOString() }),
      })
      toast({
        title: t("success"),
        description: t("settingsSaved"),
      })
    } catch (error) {
      toast({
        title: t("error"),
        description: t("errorOccurred"),
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const exportData = () => {
    try {
      const workouts = localStorage.getItem("workout-planner-workouts") || "[]"
      const templates = localStorage.getItem("workout-planner-templates") || "[]"
      const logs = localStorage.getItem("workout-planner-logs") || "[]"
      const customExercises = localStorage.getItem("workout-planner-custom-exercises") || "[]"
      const progressions = localStorage.getItem("workout-planner-progressions") || "[]"
      const user = localStorage.getItem("workout-planner-user") || "{}"
      const language = localStorage.getItem("workout-planner-language") || '"en"'
      const exportData = {
        workouts: JSON.parse(workouts),
        templates: JSON.parse(templates),
        logs: JSON.parse(logs),
        customExercises: JSON.parse(customExercises),
        progressions: JSON.parse(progressions),
        user: JSON.parse(user),
        language: JSON.parse(language),
        settings,
        exportDate: new Date().toISOString(),
      }
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `workout-planner-backup-${new Date().toLocaleDateString("sv-SE")}.json`
      link.click()
      URL.revokeObjectURL(url)
      toast({
        title: t("success"),
        description: t("dataExported"),
      })
    } catch (error) {
      toast({
        title: t("error"),
        description: t("errorOccurred"),
        variant: "destructive"
      })
    }
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)
        if (importedData.workouts) {
          localStorage.setItem("workout-planner-workouts", JSON.stringify(importedData.workouts))
        }
        if (importedData.templates) {
          localStorage.setItem("workout-planner-templates", JSON.stringify(importedData.templates))
        }
        if (importedData.settings) {
          setSettings(importedData.settings)
          localStorage.setItem("workout-planner-settings", JSON.stringify(importedData.settings))
        }
        if (importedData.logs) {
          localStorage.setItem("workout-planner-logs", JSON.stringify(importedData.logs))
        }
        if (importedData.customExercises) {
          localStorage.setItem("workout-planner-custom-exercises", JSON.stringify(importedData.customExercises))
        }
        if (importedData.progressions) {
          localStorage.setItem("workout-planner-progressions", JSON.stringify(importedData.progressions))
        }
        if (importedData.user) {
          localStorage.setItem("workout-planner-user", JSON.stringify(importedData.user))
        }
        if (importedData.language) {
          localStorage.setItem("workout-planner-language", JSON.stringify(importedData.language))
        }
        toast({
          title: t("success"),
          description: t("dataImported"),
        })
      } catch (error) {
        toast({
          title: t("error"),
          description: t("importFailed"),
          variant: "destructive"
        })
      }
    }
    reader.readAsText(file)
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      localStorage.removeItem("workout-planner-workouts")
      localStorage.removeItem("workout-planner-templates")
      localStorage.removeItem("workout-planner-settings")
      localStorage.removeItem("workout-planner-logs")
      localStorage.removeItem("workout-planner-custom-exercises")
      localStorage.removeItem("workout-planner-progressions")
      localStorage.removeItem("workout-planner-user")
      localStorage.removeItem("workout-planner-language")
      setSettings({
        notifications: true,
        reminderTime: "09:00",
        units: "metric",
      })
      toast({
        title: t("success"),
        description: t("dataCleared"),
      })
      alert("All data cleared. Please refresh the page.")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t("settings")}</h1>
          <p className="text-muted-foreground text-sm md:text-base">{t("managePreferencesAndData")}</p>
        </div>
        <SettingsIcon className="w-7 h-7 md:w-8 md:h-8 text-muted-foreground" />
      </div>

      {/* User Profile Section */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            {loading ? <Skeleton className="h-96 w-full" /> : <ProfileForm language={language} user={user ?? null} />}
          </div>
          <div>
            {loading ? <Skeleton className="h-96 w-full" /> : <PasswordForm language={language} user={user ?? null} />}
            {onLogout && !loading && (
              <div className="flex justify-end mt-6">
                <Button onClick={onLogout} variant="destructive" className="w-full md:w-auto">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("logout")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              {t("notifications")}
            </CardTitle>
            <CardDescription>{t("configureNotificationPreferences")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("workoutReminders")}</Label>
                      <p className="text-sm text-muted-foreground">{t("getNotifiedAboutScheduledWorkouts")}</p>
                    </div>
                    <Switch
                      checked={settings.notifications}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, notifications: checked }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reminder-time">{t("reminderTime")}</Label>
                    <Input
                      id="reminder-time"
                      type="time"
                      value={settings.reminderTime}
                      onChange={(e) => setSettings((prev) => ({ ...prev, reminderTime: e.target.value }))}
                      disabled={!settings.notifications}
                    />
                  </div>
                  <Button onClick={saveSettings} className="w-full">
                    {t("saveNotificationSettings")}
                  </Button>
                </>
              )}
            </>
          </CardContent>
        </Card>

        {/* Google Calendar Integration */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Google Calendar Integration</CardTitle>
            <CardDescription>Sync your workouts with Google Calendar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge variant="secondary" className="w-full justify-center py-2">
              <ExternalLink className="w-4 h-4 mr-2" />
              Integration Coming Soon
            </Badge>
            <Button variant="outline" className="w-full" disabled>
              Sync with Google Calendar
            </Button>
            <p className="text-sm text-muted-foreground">
              Google Calendar integration will be available in a future update. This will allow you to automatically
              sync your planned workouts to your Google Calendar.
            </p>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="w-full md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              {t("dataManagement")}
            </CardTitle>
            <CardDescription>{t("importExportClearData")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-2">
              <Button onClick={exportData} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                {t("exportData")}
              </Button>
              <label htmlFor="import-data" className="w-full md:w-auto">
                <input
                  id="import-data"
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={importData}
                />
                <Button asChild variant="outline">
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {t("importData")}
                  </span>
                </Button>
              </label>
              <Button onClick={clearAllData} variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                {t("clearAllData")}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t("importExportWarning")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
