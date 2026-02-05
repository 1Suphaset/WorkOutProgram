"use client"

import { Templates } from "@/components/templates"
import { useTemplate } from "./use-template"
import { useAppSettings } from "@/stores/app-settings-store"

export default function ProgressPage() {
    const { templates,exerciseDatabase, loading,addTemplate,updateTemplate,deleteTemplate } = useTemplate()
    const language = useAppSettings((s) => s.language)

    if (loading) {
        return <div className="p-6">Loading...</div>
    }

    return (
        <Templates
            templates={templates}
            addTemplate={addTemplate}
            updateTemplate={updateTemplate}
            deleteTemplate={deleteTemplate}
            exerciseDatabase={exerciseDatabase}
            language={language}
            isLoading={loading}
        />
    )
}
