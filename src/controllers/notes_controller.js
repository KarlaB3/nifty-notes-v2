const Note = require('../models/notes')

const getNotes = async (request, response) => {

    let notes = await Note.find()
    response.send(notes)
}

const getNote = async (request, response) => {
    let note = await Note.findById(request.params.id) // params contain the key and value of hte route params (:id)
        .catch(error => { // mongoose methods can handle errors with catch
            console.log("Some error while accessing data:\n" + error)
            response.status(404)
            })
    if (note) { // if we can find the note, display it
        response.json(note)
    } else { // if the note ID doesn't exist it will be undefined and return an error message
        response.json({error: "ID not found"})
    }
}

const createNote = async (request, response) => {
    let newNote = new Note({
        title: request.body.title,
        description: request.body.description,
        isCompleted: false,
        dueDate: new Date().setDate(new Date().getDate() + 1),
        createdAtDate: Date.now()
    })
    await newNote.save()
    response.status(201)
    response.json({note: newNote})
}

const updateNote = async (request, response) => {
    let updatedNote = await Note.findByIdAndUpdate(request.params.id, request.body, {new: true})
        .catch(error => { // mongoose methods can handle errors with catch
            console.log("Some error while accessing data:\n" + error)
            response.status(404)
            })
        if (updatedNote) { // if we can find the note, update it and save the changes
        response.send(updatedNote)
        } else { // if the note ID doesn't exist it will be undefined and return an error message
        response.json({error: "ID not found"})
}
}

const deleteAllNotes = async (request, response) => {
    await Note.deleteMany({})
    response.json({
        "message": "All notes deleted"
    })
}

const deleteNote = async (request, response) => {
    // find the note by id using request.params.id and delete the note
    note = await Note.findByIdAndDelete(request.params.id)
        .catch(error => { // mongoose methods can handle errors with catch
            console.log("Some error while accessing data:\n" + error)
            response.status(404)
            })
    if (note) { // if we can find the note, delete it
        response.json({message: "note deleted"})
    } else { // if the note ID doesn't exist it will be undefined and return an error message
        response.json({error: "ID not found"})
    }
}

module.exports = {getNotes, getNote, createNote, updateNote, deleteAllNotes, deleteNote}