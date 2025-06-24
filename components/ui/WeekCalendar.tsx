"use client";

import * as React from "react";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface WeekCalendarProps {
    selected?: Date;
    onSelect?: (date: Date) => void;
    weekStartsOn?: 0 | 1; // 0 = Sunday, 1 = Monday
    className?: string;
}

export function WeekCalendar({
    selected,
    onSelect,
    weekStartsOn = 1,
    className,
}: WeekCalendarProps) {
    const [baseDate, setBaseDate] = React.useState<Date>(selected ?? new Date());
    const startDate = startOfWeek(baseDate, { weekStartsOn });

    const days = [...Array(7)].map((_, i) => addDays(startDate, i));

    const isSelected = (day: Date) => selected && isSameDay(day, selected);

    return (
        <div className={cn("p-3", className)}>
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={() => setBaseDate(addDays(baseDate, -7))}
                    className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 p-0")}
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium">
                    {format(startDate, "d MMM")} -{" "}
                    {format(addDays(startDate, 6), "d MMM yyyy")}
                </span>
                <button
                    onClick={() => setBaseDate(addDays(baseDate, 7))}
                    className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 p-0")}
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            <div className="flex justify-between space-x-2">
                {days.map((day) => (
                    <button
                        key={day.toDateString()}
                        onClick={() => onSelect?.(day)}
                        className={cn(
                            buttonVariants({
                                variant: isSelected(day) ? "default" : "ghost",
                            }),
                            "flex-1 flex flex-col items-center h-16 rounded-md text-sm"
                        )}
                    >
                        <span className="font-medium">{format(day, "EEE")}</span>
                        <span>{format(day, "d")}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
