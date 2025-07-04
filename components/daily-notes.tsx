"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, Edit, Save, Calendar, Plus } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface DailyNotesProps {
  selectedDate: Date
  language: "en" | "th"
  userEmail?: string
}

interface DailyNote {
  date: string
  content: string
  createdAt: string
  updatedAt: string
  id?: string
}

export function DailyNotes({ selectedDate, language, userEmail }: DailyNotesProps) {
  const { t } = useTranslation(language)
  const [notes, setNotes] = useState<DailyNote[]>([])
  const [currentNote, setCurrentNote] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const selectedDateString = selectedDate.toLocaleDateString("sv-SE") 
  const todayNote = notes.find((note) => note.date === selectedDateString)

  useEffect(() => {
    if (!userEmail) return
    setLoading(true)
    fetch(`/api/daily-notes?user=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => setNotes(data.dailyNotes || []))
      .finally(() => setLoading(false))
  }, [userEmail])

  useEffect(() => {
    setCurrentNote(todayNote?.content || "")
    setIsEditing(false)
  }, [selectedDate, todayNote])

  const saveNote = async () => {
    if (!userEmail) return
    const now = new Date().toISOString()
    const exist = notes.find((note) => note.date === selectedDateString)
    let newNote: DailyNote
    if (currentNote.trim()) {
      newNote = {
        ...(exist || {}),
        date: selectedDateString,
        content: currentNote.trim(),
        createdAt: exist?.createdAt || now,
        updatedAt: now,
      }
      let res, data
      if (exist) {
        res = await fetch("/api/daily-notes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newNote, id: exist.id, userEmail }),
        })
        data = await res.json()
        setNotes((prev) => prev.map((n) => n.id === exist.id ? data.dailyNote : n))
      } else {
        res = await fetch("/api/daily-notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newNote, userEmail }),
        })
        data = await res.json()
        setNotes((prev) => [...prev, data.dailyNote])
      }
    } else if (exist) {
      await fetch("/api/daily-notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: exist.id, userEmail }),
      })
      setNotes((prev) => prev.filter((n) => n.id !== exist.id))
    }
    setIsEditing(false)
  }

  const recentNotes = notes
    .filter((note) => note.date !== selectedDateString)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Current Day Note */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="text-lg md:text-xl">{t("dailyNotes")}</span>
            </div>
            <Badge variant="outline" className="flex items-center text-xs md:text-sm w-fit">
              <Calendar className="w-3 h-3 mr-1" />
              {selectedDate.toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </Badge>
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            {selectedDate.toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing || !todayNote ? (
            <div className="space-y-4">
              <Textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder={t("addNote")}
                rows={4}
                className="resize-none text-sm md:text-base"
              />
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button onClick={saveNote} size="sm" className="w-full sm:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  {t("saveNote")}
                </Button>
                {todayNote && (
                  <Button variant="outline" onClick={() => setIsEditing(false)} size="sm" className="w-full sm:w-auto">
                    {t("cancel")}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 md:p-4 bg-muted/50 rounded-lg">
                <p className="whitespace-pre-wrap text-sm md:text-base">{todayNote.content}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs md:text-sm text-muted-foreground">
                <span>
                  Last updated: {new Date(todayNote.updatedAt).toLocaleString(language === "th" ? "th-TH" : "en-US")}
                </span>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="w-fit">
                  <Edit className="w-4 h-4 mr-2" />
                  {t("editNote")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Notes */}
      {recentNotes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">{t("recentNotes")}</CardTitle>
            <CardDescription className="text-sm md:text-base">{t("yourRecentDailyNotes")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48 md:h-64">
              <div className="space-y-3">
                {recentNotes.map((note) => (
                  <div key={note.date} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {new Date(note.date).toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.updatedAt).toLocaleDateString(language === "th" ? "th-TH" : "en-US")}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{note.content}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {recentNotes.length === 0 && !todayNote && (
        <Card>
          <CardContent className="text-center py-6 md:py-8">
            <BookOpen className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-base md:text-lg font-medium mb-2">Start Your Journal</h3>
            <p className="text-muted-foreground mb-4 text-sm md:text-base">
              Keep track of your daily thoughts, feelings, and progress
            </p>
            <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add First Note
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
