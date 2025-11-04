"use client"

import { Button } from "@/components/ui/button"

type Note = {
    id: string
    title: string
    content: string
    createdAt: string
    updatedAt: string
}

type NoteProps = {
    note: Note
    onEdit: () => void
    onDelete: () => void
}

export function Note({ note, onEdit, onDelete }: NoteProps) {
    return (
        <>
            <h2 className="text-lg font-bold text-lightblue-900 mb-2">{note.title}</h2>
            <p className="text-gray-600 mb-2">{note.content}</p>
            <p className="text-xs text-gray-400 mb-4">
                Created: {new Date(note.createdAt).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>
                <Button variant="outline" size="sm" onClick={onDelete}>Delete</Button>
            </div>
        </>
    )
}

