const { v4: uuidv4 } = require('uuid');
const notes = new Map();

async function create(data) {
    if (!data.title || !data.userId) {
        throw new Error("Title and userId are required");
    }
    const note = {
        id: uuidv4(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    notes.set(note.id, note);
    return note;
}

async function findById(id) {
    return notes.get(id);
}

async function findByIdAndUpdate(id, data) {
    const note = notes.get(id);
    if (!note) {
        return undefined;
    }
    const updatedNote = { ...note, ...data, updatedAt: new Date() };
    notes.set(id, updatedNote);
    return updatedNote;
}

async function findByIdAndDelete(id) {
    const note = notes.get(id);
    if (!note) {
        return undefined;
    }
    notes.delete(id);
    return note;
}

async function find() {
    return Array.from(notes.values());
}

module.exports = {
    create,
    findById,
    findByIdAndDelete,
    findByIdAndUpdate,
    find
}