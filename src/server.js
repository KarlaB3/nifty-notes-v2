const express = require('express');
const mongoose = require('mongoose')
const app = express();

app.use(express.json());

async function dbConnect(){
	try{
		await mongoose.connect('mongodb://localhost:27017/nifty_notes_db')
		console.log("Database connected!")
	} catch (error) {
		console.log(`dbConnect failed, error: ${JSON.stringify(error)}`)
	}
}

dbConnect()

app.get("/", (request, response) => {
	response.json({
		message:"Welcome to the note taking backend"
	});
});

const notesRouter = require('./routes/notes_routes')
app.use("/notes", notesRouter)

const usersRouter = require('./routes/users_routes')
app.use("/users", usersRouter)

module.exports = {
	app
}