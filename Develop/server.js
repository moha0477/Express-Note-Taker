// Dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 8080;

// MIDDLEWARE FUNCTIONS
// Listen to incoming post requests, handle data parsing, and populate the req.body object 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Sets static folder to retrieve the files in the public folder
app.use(express.static('public'));


fs.readFile("db/db.json","utf8", (err, data) => {
    if (err) throw err;
    var notes = JSON.parse(data);

    // API ROUTES
    // =============================================================

    // Route that reads the db.json file and returns all saved notes
    app.get("/api/notes", function(req, res) {
        res.json(notes);
    });

    // Route that recieves a new note to save on the request body, adds it to the db.json file, and then returns the new note to the client
    app.post("/api/notes", function(req, res) {
        // New notes are captured via req.body
        // The middleware functions give req.body the ability to capture incoming data 
        let newNote = req.body;
        // Pushes new notes into the array of existing notes
        notes.push(newNote);
        // Calls the updateFile function to add the new note to db.json
        updateFile();     
    });
    
    // Route that reads all notes from the db.json file, recieves a query parameter containing the id of a note to delete, deletes the note with the given id property, and then rewrites the existing notes to db.json
    app.delete("/api/notes/:id", function(req, res) {
        notes.splice(req.params.id, 1);
       // Calls the updateFile function to delete a note from db.json
       updateFile();
    });
   
    // HTML ROUTES
    // =============================================================

    // Route that sends user to the notes page 
    app.get('/notes', function(req, res) {
        res.sendFile(path.join(__dirname, "public/notes.html"));
    });

    // Route that sends user to the homepage
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, "public/index.html"));
    });
 
    // Updates the db.json file everytime a note is added or deleted
    function updateFile() {
        fs.writeFile("db/db.json", JSON.stringify(notes,'\t'), err => {
            if (err) throw err;
            return true;
        });
    }
});

// Starts server to begin listening to the port
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});