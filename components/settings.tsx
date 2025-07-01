"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { SettingsIcon, User, Bell, Download, Upload, Trash2, ExternalLink } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export function Settings({ language }: { language: "en" | "th" }) {
  const { t } = useTranslation(language)
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    notifications: true,
    reminderTime: "09:00",
    units: "metric",
  })

  useEffect(() => {
    const savedSettings = localStorage.getItem("workout-planner-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const saveSettings = () => {
    localStorage.setItem("workout-planner-settings", JSON.stringify(settings))
  }

  const exportData = () => {
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
        alert("Data imported successfully! Please refresh the page.")
      } catch (error) {
        alert("Import failed. Please check your backup file.")
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
        name: "",
        email: "",
        notifications: true,
        reminderTime: "09:00",
        units: "metric",
      })
      alert("All data cleared. Please refresh the page.")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("settings")}</h1>
          <p className="text-muted-foreground">{t("managePreferencesAndData")}</p>
        </div>
        <SettingsIcon className="w-8 h-8 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              {t("profile")}
            </CardTitle>
            <CardDescription>{t("updatePersonalInfo")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => setSettings((prev) => ({ ...prev, name: e.target.value }))}
                placeholder={t("yourName")}
              />
            </div>
            <div>
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
                placeholder={t("yourEmail")}
              />
            </div>
            <Button onClick={saveSettings} className="w-full">
              {t("saveProfile")}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              {t("notifications")}
            </CardTitle>
            <CardDescription>{t("configureNotificationPreferences")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Google Calendar Integration */}
        <Card>
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
        <Card>
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
