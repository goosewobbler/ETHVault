const notes = new Map();

async function create(data) {
    const note = {
        id: Date.now().toString(),
        ...data
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
    const updatedNote = { ...note, ...data };
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