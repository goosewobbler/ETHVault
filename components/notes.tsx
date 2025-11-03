"use client"

import { useState } from "react"
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

export function Notes() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [notes, setNotes] = useState<Note[]>([])

    const createNote = async (title: string, content: string) => {
        const note = await axios.post("/api/notes", { title, content })
        return note
    }

    const updateNote = async (id: string, title: string, content: string) => {
        const note = await axios.put(`/api/notes/${id}`, { title, content })
        return note
    }

    const deleteNote = async (id: string) => {
        const note = await axios.delete(`/api/notes/${id}`)
        return note
    }

    const handleCreateNote = async () => {
        setIsCreating(true)
        try {
            const response = await createNote(title, content)
            const note = response.data as Note
            setNotes([...notes, note])
        } catch (error) {
            console.error(error)
        }
    }

    const handleEditNote = async (id: string, title: string, content: string) => {
        setIsEditing(true)
        try {
            const response = await updateNote(id, title, content)
            const note = response.data as Note
            setNotes(notes.map((note: Note) => note.id === id ? note : note))
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteNote = async (id: string) => {
        setIsDeleting(true)
        try {
            await deleteNote(id)
            setNotes(notes.filter((note: Note) => note.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-lightblue-900 mb-4">Notes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((note: Note) => (
                    <div key={note.id} className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-lg font-bold text-lightblue-900 mb-2">{note.title}</h2>
                        <p className="text-gray-600 mb-4">{note.createdAt}</p>
                        <p className="text-gray-600 mb-4">{note.content}</p>
                        <p className="text-gray-600 mb-4">{note.updatedAt}</p>
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} disabled={isEditing}>Edit</Button>
                        <Button variant="outline" size="sm" onClick={() => setIsDeleting(true)} disabled={isDeleting}>Delete</Button>
                        {isEditing && (
                            <div className="mt-8">
                                <h2 className="text-lg font-bold text-lightblue-900 mb-4">Edit Note</h2>
                                <Input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                                <Input type="text" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
                                <Button onClick={() => handleEditNote(note.id, title, content)}>Save</Button>
                            </div>
                        )}
                        {isDeleting && (
                            <div className="mt-8">
                                <h2 className="text-lg font-bold text-lightblue-900 mb-4">Delete Note</h2>
                                <Button onClick={() => handleDeleteNote(note.id)}>Delete</Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <Button onClick={() => setIsCreating(true)}>Create Note</Button>
            </div>
            {isCreating && (
                <div className="mt-8">
                    <h2 className="text-lg font-bold text-lightblue-900 mb-4">Create Note</h2>
                    <Input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <Input type="text" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
                    <Button onClick={handleCreateNote}>Create</Button>
                </div>
            )}
        </div>
    )
}