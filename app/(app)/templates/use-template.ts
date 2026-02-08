"use client"

import { useEffect, useState } from "react"
import type { Exercise,Template } from "@/lib/types/workout"
import { useAuthStore } from "@/stores/auth-store"
import { useRef } from "react"
export function useTemplate() {
    const [exerciseDatabase, setExerciseDatabase] = useState<Exercise[]>([])
    const [templates, setTemplates] = useState<Template[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuthStore()
    const fetchedRef = useRef(false)
    const fetchTemplates = async () => {
        if (!user) return
        setLoading(true)

        try {
            const res = await fetch(
                `/api/templates?user=${encodeURIComponent(user.email)}`
            )
            const data = await res.json()

            setTemplates(data.templates ?? [])
        } catch (err) {
            console.error("fetch templates error", err)
            setTemplates([])
        } finally {
            setLoading(false)
        }
    }

    const fetchExercises = async () => {
        if (!user) return
        setLoading(true)

        try {
            const res = await fetch(
                `/api/exercises?user=${encodeURIComponent(user.email)}`
            )
            const data = await res.json()

            setExerciseDatabase(data.exercises ?? [])
        } catch (err) {
            console.error("fetch exercises error", err)
            setExerciseDatabase([])
        } finally {
            setLoading(false)
        }
    }



    useEffect(() => {
        if (!user || fetchedRef.current) return
        fetchedRef.current = true
        fetchTemplates();
        fetchExercises();
    }, [user])


    const normalizeExercises = (exercises: Exercise[] = []) =>
        exercises.map((ex) => ({
            ...ex,
            id: Number(ex.id),
        }))

    const addTemplate = async (template: Template) => {
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

    const updateTemplate = async (templateId: number, updatedTemplate: Partial<Template>) => {
        const template = templates.find(t => Number(t.id) === Number(templateId))
        if (!template) return;
        const fullTemplate: Template = {
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

