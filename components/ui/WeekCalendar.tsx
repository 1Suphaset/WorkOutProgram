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
}

export function WeekCalendar({
  selected,
  onSelect,
  weekStartsOn = 1,
  className,
}: WeekCalendarProps) {
  const [baseDate, setBaseDate] = React.useState<Date>(selected ?? new Date())
  const startDate = startOfWeek(baseDate, { weekStartsOn })
  const days = [...Array(7)].map((_, i) => addDays(startDate, i))

  const isSelected = (day: Date) => selected && isSameDay(day, selected)

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
          const selectedStyle = isSelected(day)
            ? "bg-primary text-white hover:bg-primary/90"
            : "bg-muted text-muted-foreground hover:bg-accent"

          return (
            <button
              key={day.toDateString()}
              onClick={() => onSelect?.(day)}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl px-4 py-3 text-sm transition-colors font-medium h-[72px]",
                selectedStyle
              )}
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
