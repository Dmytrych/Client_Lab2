let currentNote = {id: 0, name: "Note", content: "", creationDate: ""};
let currentHighlightedNote;
let notes = [currentNote];
let maxId = 0;

function initDate(note){
    let dateTime = new Date();
    note.creationDate = dateTime.getDate() + "." + dateTime.getMonth() + "." + dateTime.getFullYear();
}

function fillNotesBlock(notesList){
    const leftBar = document.getElementById("left-bar");
    leftBar.innerHTML = "";
    
    for(let i = 0; i < notesList.length; i++){
        let noteBlock = document.createElement("li");
        noteBlock.innerHTML = "<h2>" + notesList[i].name  + "</h2> <h5>" + notesList[i].creationDate + "</h5>";
        noteBlock.className = "note-nav-btn note-btn list-group-item";
        noteBlock.onclick = function (){ noteSelectHandler(notesList[i]); highlightSelectedNote(noteBlock);}
        if(currentNote === notesList[i]){
            highlightSelectedNote(noteBlock);
        }
        leftBar.append(noteBlock);
        if(i == notesList.length - 1 && currentHighlightedNote == null){
            currentNote = notesList[i];
            highlightSelectedNote(noteBlock);
            noteSelectHandler(currentNote);
        }
    }
    maxId = localStorage.getItem("maxId");
}

function noteSelectHandler(note){
    history.pushState(null, null, "?id=" + note.id);
    currentNote = note;
    let textarea1 = document.getElementById("main-textarea");
    textarea1.value = note.content;
}

function delButtonById(deleteId){
    for(let i = 0; i < notes.length; i++){
        if(notes[i].id == deleteId){
            notes.splice(i, 1);
        }
    }
}

function removeButton(){
    delButtonById(currentNote.id);
    if(notes.length >= 1){
        currentNote = notes[0];
        noteSelectHandler(currentNote);
    }
    console.log(notes);
    fillNotesBlock(notes);
}

function saveNotesData(){
    localStorage.setItem("notesData", JSON.stringify(notes));
}

const addNoteButton = document.getElementById("add-note-button");
addNoteButton.addEventListener("click", () => {
    let newNote = {id: ++maxId, name: "Note", content: "", creationDate: ""};
    initDate(newNote);
    notes.push(newNote);
    saveNotesData();
    localStorage.setItem("maxId", maxId);
    fillNotesBlock(notes);
});

const saveButton = document.getElementById("save-button");
saveButton.addEventListener("click", () => {
    if(notes.includes(currentNote)){
        let textarea1 = document.getElementById("main-textarea");
        currentNote.content = textarea1.value;
        saveNotesData();
    }
})

const delButton = document.getElementById("del-button");
delButton.addEventListener("click", () => {
    let textarea1 = document.getElementById("main-textarea");
    textarea1 = "";
    removeButton();
})

const renameButton = document.getElementById("rename-button");
renameButton.addEventListener("click", () => {
    currentNote.name = prompt('Enter new note name:', "Note");
    fillNotesBlock(notes);
    saveNotesData()
})

function notesUpdate(){
    if(localStorage.length != 0){
        notes = JSON.parse(localStorage.getItem("notesData"));
    }
}

function parseId(str){
    return str.slice(4);
}

function findNoteById(id){
    let resultNote = notes.find((element) => {
        if(element.id == id) {
            return element;
        }
        else return false;
    })
    if(!resultNote){
        resultNote == notes[0];
    }
    return resultNote
}

function highlightSelectedNote(noteBlock){
    if(currentHighlightedNote != null){
        currentHighlightedNote.classList.toggle("selected-btn", false);
    }
    noteBlock.classList.toggle("selected-btn", true);
    currentHighlightedNote = noteBlock;
}

initDate(currentNote);
let urlData = window.location.search;
if(localStorage.getItem("notesData")){
    notesUpdate();
}
if(urlData.length != 0){
    noteSelectHandler(findNoteById(parseId(urlData)));
}
fillNotesBlock(notes);