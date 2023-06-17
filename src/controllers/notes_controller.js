const Note = require('../models/notes')
const User = require('../models/user')

const getNotes = async (request, response) => {
    console.log(request.query)
    let notes
    if (Object.keys(request.query).length > 0) { 
        // Cover true and false cases for boolean query string
        if (request.query.isCompleted === "true")
            notes = await Note.find({isCompleted: true})     
        else if (request.query.isCompleted === "false")
            notes = await Note.find({isCompleted: false})
        else {
            notes = await Note.find()
        }
        response.send(notes)
    } else {
        notes = await Note.find()
    }
    response.send(notes)
}

const getMyNotes = async (request, response) => {
  // find user by username, once we have authorisation, this can be taken from the token
  let user = await User.findOne({username: request.body.username}).populate('notes')
  response.send(user.notes)
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
    let user = await User.findOne({username: request.body.username})

    let newNote = new Note({
        title: request.body.title,
        description: request.body.description,
        isCompleted: false,
        dueDate: new Date().setDate(new Date().getDate() + 1),
        createdAtDate: Date.now()
    })
    await newNote.save()
    user.notes.push(newNote._id)
    await user.save()
    response.status(201)
    response.json({
        user: user,
        note: newNote
    })
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
  let user = await User.findOne({username: request.body.username})

  // find the note by id using request.params.id and delete the note
  note = await Note.findByIdAndDelete(request.params.id)
      .catch(error => { // mongoose methods can handle errors with catch
          console.log("Some error while accessing data:\n" + error)
          response.status(404)
          })
  // if we can find the note, delete it        
  if (note) { 
    // remove the note ID from the user's note array
    user.notes.shift(note._id);
    response.json({message: "note deleted"})
    } else { // if the note ID doesn't exist it will be undefined and return an error message
      response.json({error: "ID not found"})
  }
}

module.exports = {getNotes, getMyNotes, getNote, createNote, updateNote, deleteAllNotes, deleteNote}