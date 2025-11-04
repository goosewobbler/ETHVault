"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { NoteForm } from "@/components/note-form"
import { CreateNoteButton } from "@/components/create-note-button"
import { Note as NoteComponent } from "@/components/note"
import type { Note } from "@/types/notes"

const api = axios.create({
    baseURL: 'http://localhost:4001',
})

export function Notes() {
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
    const [notes, setNotes] = useState<Note[]>([])
    const [loading, setLoading] = useState(false)

    // Fetch notes on component mount
    useEffect(() => {
        fetchNotes()
    }, [])

    const fetchNotes = async () => {
        setLoading(true)
        try {
            const response = await api.get("/api/notes")
            setNotes(response.data.notes || [])
        } catch (error) {
            console.error("Error fetching notes:", error)
        } finally {
            setLoading(false)
        }
    }

    const createNote = async (title: string, content: string) => {
        const response = await api.post("/api/notes", { title, content })
        return response.data.note
    }

    const updateNote = async (id: string, title: string, content: string) => {
        const response = await api.put(`/api/notes/${id}`, { title, content })
        return response.data.note
    }

    const deleteNote = async (id: string) => {
        await api.delete(`/api/notes/${id}`)
    }

    const handleCreateNote = async (title: string, content: string) => {
        setIsCreating(true)
        try {
            const note = await createNote(title, content)
            setNotes([...notes, note])
            setShowCreateForm(false)
        } catch (error) {
            console.error("Error creating note:", error)
        } finally {
            setIsCreating(false)
        }
    }

    const handleEditNote = async (id: string, title: string, content: string) => {
        try {
            const updatedNote = await updateNote(id, title, content)
            setNotes(notes.map((note: Note) => note.id === id ? updatedNote : note))
            setEditingNoteId(null)
        } catch (error) {
            console.error("Error updating note:", error)
        }
    }

    const handleDeleteNote = async (id: string) => {
        try {
            await deleteNote(id)
            setNotes(notes.filter((note: Note) => note.id !== id))
        } catch (error) {
            console.error("Error deleting note:", error)
        }
    }

    const startEditing = (note: Note) => {
        setEditingNoteId(note.id)
    }

    const cancelEditing = () => {
        setEditingNoteId(null)
    }

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-lightblue-900 mb-4">Notes</h1>
            
            {loading && <p className="text-gray-600">Loading notes...</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {notes.map((note: Note) => (
                    <div key={note.id} className="bg-white rounded-lg shadow-md p-4">
                        {editingNoteId === note.id ? (
                            <NoteForm
                                onSubmit={(title, content) => handleEditNote(note.id, title, content)}
                                onCancel={cancelEditing}
                                isSubmitting={false}
                                initialTitle={note.title}
                                initialContent={note.content}
                                mode="edit"
                                className="mt-0 bg-transparent shadow-none p-0"
                            />
                        ) : (
                            <NoteComponent
                                note={note}
                                onEdit={() => startEditing(note)}
                                onDelete={() => handleDeleteNote(note.id)}
                            />
                        )}
                    </div>
                ))}
            </div>
            
            {showCreateForm ? (
                <NoteForm 
                    onSubmit={handleCreateNote}
                    onCancel={() => setShowCreateForm(false)}
                    isSubmitting={isCreating}
                />
            ) : (
                <CreateNoteButton onClick={() => setShowCreateForm(true)} />
            )}
        </div>
    )
}