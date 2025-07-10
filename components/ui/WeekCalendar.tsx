"use client"

import * as React from "react"
import { addDays, format, isSameDay, startOfWeek } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface WeekCalendarProps {
  selected?: Date
  onSelect?: (date: Date) => void
  weekStartsOn?: 0 | 1
  className?: string
  workouts?: { date: string; completed?: boolean }[]
}

export function WeekCalendar({
  selected,
  onSelect,
  weekStartsOn = 1,
  className,
  workouts = [],
}: WeekCalendarProps) {
  const [baseDate, setBaseDate] = React.useState<Date>(selected ?? new Date())
  const startDate = startOfWeek(baseDate, { weekStartsOn })
  const days = [...Array(7)].map((_, i) => addDays(startDate, i))

  const isSelected = (day: Date) => selected && isSameDay(day, selected)

  // ฟังก์ชันเช็คว่าวันนี้มี workout หรือ completed
  const getDayStatus = (day: Date) => {
    const dayStr = day.toLocaleDateString("sv-SE")
    const dayWorkouts = workouts.filter(w => {
      // รองรับทั้ง date string และ Date object
      const wDate = typeof w.date === "string" ? new Date(w.date) : w.date
      return isSameDay(day, wDate)
    })
    if (dayWorkouts.some(w => w.completed)) return "completed"
    if (dayWorkouts.length > 0) return "hasWorkout"
    return "none"
  }

  return (
    <div className={cn("p-4 rounded-md border shadow-sm bg-background", className)}>
      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setBaseDate(addDays(baseDate, -7))}
          className={cn(buttonVariants({ variant: "ghost" }), "h-8 w-8 p-0")}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-sm font-medium text-center flex-1">
          {format(startDate, "d MMM")} – {format(addDays(startDate, 6), "d MMM yyyy")}
        </div>
        <button
          onClick={() => setBaseDate(addDays(baseDate, 7))}
          className={cn(buttonVariants({ variant: "ghost" }), "h-8 w-8 p-0")}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {days.map((day) => {
          const status = getDayStatus(day)
          let dayClass = ""
          if (status === "completed") dayClass = "bg-green-300 text-white"
          else if (status === "hasWorkout") dayClass = "bg-yellow-300 text-black"
          else dayClass = "bg-muted text-muted-foreground"

          return (
            <button
              key={day.toDateString()}
              onClick={() => onSelect?.(day)}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl px-4 py-3 text-sm transition-colors font-medium h-[72px]",
                dayClass,
                isSelected(day) ? "ring-2 ring-primary aria-selected:opacity-100" : "",
              )}
              aria-selected={isSelected(day)}
            >
              <span>{format(day, "EEE")}</span>
              <span className="text-base font-bold">{format(day, "d")}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
