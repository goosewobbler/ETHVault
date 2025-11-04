"use client"

import { Button } from "@/components/ui/button"
import type { Note } from "@/types/notes"

type NoteProps = {
    note: Note
    onEdit: (() => void) & { __isClientHandler?: true }
    onDelete: (() => void) & { __isClientHandler?: true }
}

export function Note({ note, onEdit, onDelete }: NoteProps) {
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const createdAt = formatDateTime(note.createdAt)
    const updatedAt = formatDateTime(note.updatedAt)
    const isUpdated = note.createdAt !== note.updatedAt

    return (
        <>
            <h2 className="text-lg font-bold text-lightblue-900 mb-2">{note.title}</h2>
            <p className="text-gray-600 mb-2">{note.content}</p>
            <div className="text-xs text-gray-400 mb-4 space-y-1">
                <p>Created: {createdAt}</p>
                {isUpdated && (
                    <p>Updated: {updatedAt}</p>
                )}
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>
                <Button variant="outline" size="sm" onClick={onDelete}>Delete</Button>
            </div>
        </>
    )
}

