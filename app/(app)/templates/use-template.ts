"use client"

import { useEffect, useState } from "react"
import type { Exercise } from "@/lib/types/workout"
import type { WorkoutTemplate } from "@/lib/workout-templates"
import { useAuthStore } from "@/stores/auth-store"

export function useTemplate() {
    const [exerciseDatabase, setExerciseDatabase] = useState<Exercise[]>([])
    const [templates, setTemplates] = useState<WorkoutTemplate[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuthStore()

    const fetchData = async () => {
        if (!user) return
        setLoading(true)

        try {
            const [t, e] = await Promise.all([
                fetch(`/api/templates?user=${encodeURIComponent(user.email)}`).then(r => r.json()),
                fetch(`/api/exercises?user=${encodeURIComponent(user.email)}`).then(r => r.json()),
            ])

            setTemplates(t.templates ?? [])
            setExerciseDatabase(e.exercises ?? [])
        } catch (err) {
            console.error("fetch templates error", err)
            setTemplates([])
            setExerciseDatabase([])
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (!user) return;
        fetchData();
        // ไม่มี setInterval อีกต่อไป
    }, [user])


    const normalizeExercises = (exercises: any[] = []) =>
        exercises.map((ex) => ({
            ...ex,
            id: Number(ex.id),
            instructions: ex.instructions ?? "",
        }))

    const addTemplate = async (template: WorkoutTemplate) => {
        if (!user) return false

        const res = await fetch("/api/templates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...template,
                exercises: normalizeExercises(template.exercises),
                userEmail: user.email,
            }),
        })

        if (!res.ok) return false

        const data = await res.json()
        setTemplates((prev) => [data.template, ...prev])
        return true
    }

    const updateTemplate = async (templateId: number, updatedTemplate: Partial<WorkoutTemplate>) => {
        const template = templates.find(t => Number(t.id) === Number(templateId))
        if (!template) return;
        const fullTemplate: WorkoutTemplate = {
            ...template,
            ...updatedTemplate,
            type: updatedTemplate.type || template.type,
            exercises: (updatedTemplate.exercises || template.exercises || []).map((ex: any) => ({
                ...ex,
                id: Number(ex.id),
                sets: ex.sets,
                reps: ex.reps,
                duration: ex.duration,
                rest: ex.rest,
                instructions: ex.instructions || "",
            })),
        };
        const res = await fetch("/api/templates", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fullTemplate),
        })
        if (!res.ok) throw new Error("Failed to add template")

        const data = await res.json()
        setTemplates(prev => prev.map(t => Number(t.id) === Number(templateId) ? data.template : t))
    }

    // ลบ template
    const deleteTemplate = async (templateId: number) => {
        const prev = templates
        setTemplates((t) => t.filter(x => Number(x.id) !== templateId))

        const res = await fetch("/api/templates", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: templateId }),
        })

        if (!res.ok) {
            setTemplates(prev) // rollback
            return false
        }

        return true
    }

    return { templates, exerciseDatabase, loading, addTemplate, updateTemplate, deleteTemplate }
}

