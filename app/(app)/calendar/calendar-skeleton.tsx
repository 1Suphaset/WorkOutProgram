"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CalendarSkeleton() {
    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 mx-auto animate-pulse">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-56" />
                    <Skeleton className="h-4 w-72" />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Skeleton className="h-10 w-full sm:w-40 rounded-md" />
                    <Skeleton className="h-10 w-full sm:w-32 rounded-md" />
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

                {/* Calendar Card */}
                <Card>
                    <CardHeader className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[320px] w-full rounded-md" />
                    </CardContent>
                </Card>

                {/* Selected Date Workouts */}
                <Card>
                    <CardHeader className="space-y-2">
                        <Skeleton className="h-6 w-72" />
                        <Skeleton className="h-4 w-40" />
                    </CardHeader>

                    <CardContent>
                        <div className="h-[350px] space-y-4 overflow-hidden">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="border rounded-lg p-4 space-y-3"
                                >
                                    {/* Top Row */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Skeleton className="w-3 h-3 rounded-full" />
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-5 w-20 rounded-full" />
                                        </div>

                                        <div className="flex space-x-2">
                                            <Skeleton className="h-8 w-12 rounded-md" />
                                            <Skeleton className="h-8 w-8 rounded-md" />
                                            <Skeleton className="h-8 w-8 rounded-md" />
                                        </div>
                                    </div>

                                    {/* Meta */}
                                    <Skeleton className="h-3 w-28" />

                                    {/* Exercises preview */}
                                    <div className="space-y-1">
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-5/6" />
                                        <Skeleton className="h-3 w-4/6" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Daily Notes Section */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-28 w-full rounded-md" />
                </CardContent>
            </Card>
        </div>
    )
}
