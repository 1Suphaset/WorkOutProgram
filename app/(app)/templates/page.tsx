"use client"

import { Templates } from "@/components/templates"
import { useTemplate } from "./use-template"
import { useAppSettings } from "@/stores/app-settings-store"
import { TemplatePageSkeleton } from "./template-skeleton"
export default function TemplatePage() {
    const { templates,exerciseDatabase, loading,addTemplate,updateTemplate,deleteTemplate } = useTemplate()
    const language = useAppSettings((s) => s.language)

    if (loading) {
        return <TemplatePageSkeleton />
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
