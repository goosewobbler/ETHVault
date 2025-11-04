"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type NoteFormProps = {
    onSubmit: (title: string, content: string) => Promise<void>
    onCancel: () => void
    isSubmitting?: boolean
    initialTitle?: string
    initialContent?: string
    mode?: "create" | "edit"
    className?: string
}

export function NoteForm({ 
    onSubmit, 
    onCancel, 
    isSubmitting = false, 
    initialTitle = "", 
    initialContent = "",
    mode = "create",
    className = ""
}: NoteFormProps) {
    const [title, setTitle] = useState(initialTitle)
    const [content, setContent] = useState(initialContent)

    // Update form values when initial values change (for edit mode)
    useEffect(() => {
        setTitle(initialTitle)
        setContent(initialContent)
    }, [initialTitle, initialContent])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) return
        
        await onSubmit(title, content)
        
        // Only clear form if in create mode
        if (mode === "create") {
            setTitle("")
            setContent("")
        }
    }

    const handleCancel = () => {
        if (mode === "create") {
            setTitle("")
            setContent("")
        } else {
            // Reset to initial values for edit mode
            setTitle(initialTitle)
            setContent(initialContent)
        }
        onCancel()
    }

    const formTitle = mode === "edit" ? "Edit Note" : "Create Note"
    const submitButtonText = mode === "edit" ? "Save" : "Create"

    return (
        <div className={className || "mt-8 bg-white rounded-lg shadow-md p-4"}>
            <h2 className="text-lg font-bold text-lightblue-900 mb-4">{formTitle}</h2>
            <form onSubmit={handleSubmit}>
                <Input 
                    type="text" 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="mb-2"
                    disabled={isSubmitting}
                />
                <Input 
                    type="text" 
                    placeholder="Content" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    className="mb-2"
                    disabled={isSubmitting}
                />
                <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting || !title.trim() || !content.trim()}>
                        {submitButtonText}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    )
}

