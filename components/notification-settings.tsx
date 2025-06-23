"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Clock, Mail, Smartphone, MessageSquare, CheckCircle } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface NotificationSettingsProps {
  language: "en" | "th"
}

export function NotificationSettings({ language }: NotificationSettingsProps) {
  const { t } = useTranslation(language)
  const [enabled, setEnabled] = useState(false)
  const [reminderTime, setReminderTime] = useState("18:00")
  const [method, setMethod] = useState("push")
  const [savedSettings, setSavedSettings] = useState<{ time: string; method: string } | null>(null)

  const handleSave = () => {
    setSavedSettings({ time: reminderTime, method })
    // Mock save to localStorage
    localStorage.setItem(
      "workout-reminders",
      JSON.stringify({
        enabled,
        time: reminderTime,
        method,
      }),
    )
  }

  const getMethodIcon = (methodType: string) => {
    switch (methodType) {
      case "email":
        return <Mail className="w-4 h-4" />
      case "sms":
        return <MessageSquare className="w-4 h-4" />
      default:
        return <Smartphone className="w-4 h-4" />
    }
  }

  const getMethodLabel = (methodType: string) => {
    switch (methodType) {
      case "email":
        return t("email")
      case "sms":
        return t("sms")
      default:
        return t("push")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            {t("workoutReminders")}
          </CardTitle>
          <CardDescription>{t("setReminders")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable Reminders</Label>
              <p className="text-sm text-muted-foreground">Get daily notifications to stay on track</p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          {enabled && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center mb-2">
                    <Clock className="w-4 h-4 mr-1" />
                    {t("reminderTime")}
                  </Label>
                  <Input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} />
                </div>

                <div>
                  <Label className="mb-2 block">{t("notificationMethod")}</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="push">
                        <div className="flex items-center">
                          <Smartphone className="w-4 h-4 mr-2" />
                          {t("push")}
                        </div>
                      </SelectItem>
                      <SelectItem value="email">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          {t("email")}
                        </div>
                      </SelectItem>
                      <SelectItem value="sms">
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {t("sms")}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                {t("saveReminder")}
              </Button>
            </div>
          )}

          {savedSettings && enabled && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center text-green-800">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  {t("reminderSet")} {savedSettings.time}
                </span>
              </div>
              <div className="flex items-center mt-2 text-green-700">
                {getMethodIcon(savedSettings.method)}
                <span className="ml-2 text-sm">via {getMethodLabel(savedSettings.method)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bell className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium">Workout Reminder</p>
                <p className="text-sm text-muted-foreground">Time for your daily workout! 💪</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
