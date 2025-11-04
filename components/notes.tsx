"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


type Note = {
    id: string
    title: string
    content: string
    createdAt: string
    updatedAt: string
}

const api = axios.create({
    baseURL: 'http://localhost:4001',
})

export function Notes() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
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

    const handleCreateNote = async () => {
        if (!title.trim() || !content.trim()) return
        
        setIsCreating(true)
        try {
            const note = await createNote(title, content)
            setNotes([...notes, note])
            setTitle("")
            setContent("")
            setShowCreateForm(false)
        } catch (error) {
            console.error("Error creating note:", error)
        } finally {
            setIsCreating(false)
        }
    }

    const handleEditNote = async (id: string, title: string, content: string) => {
        if (!title.trim() || !content.trim()) return
        
        try {
            const updatedNote = await updateNote(id, title, content)
            setNotes(notes.map((note: Note) => note.id === id ? updatedNote : note))
            setEditingNoteId(null)
            setTitle("")
            setContent("")
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
        setTitle(note.title)
        setContent(note.content)
    }

    const cancelEditing = () => {
        setEditingNoteId(null)
        setTitle("")
        setContent("")
    }

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-lightblue-900 mb-4">Notes</h1>
            
            {loading && <p className="text-gray-600">Loading notes...</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {notes.map((note: Note) => (
                    <div key={note.id} className="bg-white rounded-lg shadow-md p-4">
                        {editingNoteId === note.id ? (
                            <div className="mt-4">
                                <h2 className="text-lg font-bold text-lightblue-900 mb-4">Edit Note</h2>
                                <Input 
                                    type="text" 
                                    placeholder="Title" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    className="mb-2"
                                />
                                <Input 
                                    type="text" 
                                    placeholder="Content" 
                                    value={content} 
                                    onChange={(e) => setContent(e.target.value)} 
                                    className="mb-2"
                                />
                                <div className="flex gap-2">
                                    <Button onClick={() => handleEditNote(note.id, title, content)}>Save</Button>
                                    <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-lg font-bold text-lightblue-900 mb-2">{note.title}</h2>
                                <p className="text-gray-600 mb-2">{note.content}</p>
                                <p className="text-xs text-gray-400 mb-4">
                                    Created: {new Date(note.createdAt).toLocaleDateString()}
                                </p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => startEditing(note)}>Edit</Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDeleteNote(note.id)}>Delete</Button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            
            {showCreateForm ? (
                <div className="mt-8 bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-lg font-bold text-lightblue-900 mb-4">Create Note</h2>
                    <Input 
                        type="text" 
                        placeholder="Title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        className="mb-2"
                    />
                    <Input 
                        type="text" 
                        placeholder="Content" 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        className="mb-2"
                    />
                    <div className="flex gap-2">
                        <Button onClick={handleCreateNote} disabled={isCreating}>Create</Button>
                        <Button variant="outline" onClick={() => {
                            setShowCreateForm(false)
                            setTitle("")
                            setContent("")
                        }} disabled={isCreating}>Cancel</Button>
                    </div>
                </div>
            ) : (
                <div className="mt-8">
                    <Button onClick={() => setShowCreateForm(true)}>Create Note</Button>
                </div>
            )}
        </div>
    )
}