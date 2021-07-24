// ===============================================================
//========================= Dependencies==========================
// ===============================================================
const express = require('express');
const fs = require("fs");
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// ===============================================================
//====================== CONFIGURATION ===========================
// ===============================================================
const PORT = process.env.PORT || 3001; // Sets an initial port.
const app = express(); // node -> 'express' server

// ===============================================================
//======================= DATA PARSING ===========================
// ===============================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//// ====================================================================
// =========================Filling======================================
//// ====================================================================
const readFile = () => {
    // Read data from 'db.json' file
    return JSON.parse(fs.readFileSync("./db/db.json", "utf8", err => {
        if (err) {
            console.log(err); //error handling
        }
    }));
}
const writeFile = (file) => {
    // write data to a 'db.json' file
    fs.writeFileSync('./db/db.json', JSON.stringify(file), err => {
        if (err) {
            console.log(err);
        }
    });
    return file;

}
// ===============================================================
// =====================API ROUTES================================
// ===============================================================
  //READING DATA FROM FILE REQUEST
  app.get('/api/notes', (req, res) => {
    res.json(readFile());
});


//ADDING DATA TO A FILE ON REQUEST 
app.post('/api/notes', (req, res) => {
    // retrieved new note from request body
    let newNote = req.body;
    // Assigned unique id obtained from uuid npm package
    newNote.id = uuidv4();
    let file = readFile();
    // Pushed new note in notes file
    file.push(newNote);
    // Written notes data to 'db.json' file
    writeFile(file);
    //RESPONDING
    res.json(newNote);
});

//DELETING DATA FRON A FILE
app.delete('/api/notes/:id', (req, res) => {
    //get the id of a note needs to be deleted
    let id = req.params.id.toString();
    //READING FILE
    let file = readFile();
    // filter data to get notes except the one to be deleted
    const newFile = file.filter(data => data.id.toString() !== id)
    writeFile(newFile);
    res.json(newFile);
});
// ===============================================================
// =====================HTML ROUTES===============================
// ===============================================================
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});
//open index.html when / 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});
//open index.html when * 
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});
// ===============================================================
// ===========================Listener============================
// ===============================================================
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});