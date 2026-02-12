"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TemplatePageSkeleton() {
    return (
        <div className="p-6 space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-56" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-9 w-40" />
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="space-y-2">
                            {/* Template Title */}
                            <Skeleton className="h-5 w-40" />
                            {/* Type badge */}
                            <Skeleton className="h-4 w-20 rounded-full" />
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Exercises summary */}
                            <Skeleton className="h-4 w-32" />

                            {/* Fake exercise list preview */}
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-5/6" />
                                <Skeleton className="h-3 w-4/6" />
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-between pt-4">
                                <Skeleton className="h-8 w-20 rounded-md" />
                                <Skeleton className="h-8 w-20 rounded-md" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
