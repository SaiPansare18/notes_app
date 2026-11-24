// ---------- 1. Get elements from the page ----------
const titleInput   = document.getElementById("title");
const contentInput = document.getElementById("content");
const colourInput  = document.getElementById("colour");
const saveBtn      = document.getElementById("saveBtn");
const cancelBtn    = document.getElementById("cancelBtn");
const searchInput  = document.getElementById("search");
const notesList    = document.getElementById("notesList");
const themeBtn     = document.getElementById("themeBtn");

// ---------- 2. Variables ----------
let notes = [];        // all notes are stored in this list
let editIndex = -1;    // -1 means "adding a new note", any other number means "editing that note"

// Load notes saved earlier (so they stay after refresh)
let saved = localStorage.getItem("notes");
if (saved !== null) {
    notes = JSON.parse(saved);
}

function saveToStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// ---------- 3. Add or update a note ----------
function saveNote() {
    let title = titleInput.value;
    let content = contentInput.value;
    let colour = colourInput.value;

    if (title === "" && content === "") {
        alert("Please write something first!");
        return;
    }

    if (editIndex === -1) {
        // add a new note
        let note = {
            title: title,
            content: content,
            colour: colour,
            pinned: false
        };
        notes.push(note);
    } else {
        // update the old note
        notes[editIndex].title = title;
        notes[editIndex].content = content;
        notes[editIndex].colour = colour;
        resetForm();
    }

    titleInput.value = "";
    contentInput.value = "";
    saveToStorage();
    showNotes();
}

// ---------- 4. Delete a note ----------
function deleteNote(index) {
    let sure = confirm("Delete this note?");
    if (sure === true) {
        notes.splice(index, 1);   // remove 1 note at this position
        saveToStorage();
        showNotes();
    }
}

// ---------- 5. Pin / Unpin ----------
function togglePin(index) {
    if (notes[index].pinned === true) {
        notes[index].pinned = false;
    } else {
        notes[index].pinned = true;
    }
    saveToStorage();
    showNotes();
}

// ---------- 6. Edit a note ----------
function editNote(index) {
    titleInput.value = notes[index].title;
    contentInput.value = notes[index].content;
    colourInput.value = notes[index].colour;

    editIndex = index;
    saveBtn.textContent = "Update Note";
    cancelBtn.classList.remove("hidden");
}

function resetForm() {
    editIndex = -1;
    titleInput.value = "";
    contentInput.value = "";
    saveBtn.textContent = "Add Note";
    cancelBtn.classList.add("hidden");
}

// ---------- 7. Show all notes on the page ----------
function showNotes() {
    let searchText = searchInput.value.toLowerCase();

    let pinnedHTML = "";   // cards of pinned notes
    let normalHTML = "";   // cards of other notes

    for (let i = 0; i < notes.length; i++) {
        let note = notes[i];

        let titleLower = note.title.toLowerCase();
        let contentLower = note.content.toLowerCase();

        // show the note only if it matches the search text
        if (titleLower.includes(searchText) || contentLower.includes(searchText)) {

            let cardClass = "note " + note.colour;
            let pinText = "Pin";

            if (note.pinned === true) {
                cardClass = cardClass + " pinned";
                pinText = "Unpin";
            }

            // build the card as HTML text
            let card = '<div class="' + cardClass + '">' +
                '<h3>' + note.title + '</h3>' +
                '<p>' + note.content + '</p>' +
                '<button onclick="togglePin(' + i + ')">' + pinText + '</button>' +
                '<button onclick="editNote(' + i + ')">Edit</button>' +
                '<button onclick="deleteNote(' + i + ')">Delete</button>' +
                '</div>';

            if (note.pinned === true) {
                pinnedHTML = pinnedHTML + card;
            } else {
                normalHTML = normalHTML + card;
            }
        }
    }

    let allCards = pinnedHTML + normalHTML;   // pinned notes come first

    if (allCards === "") {
        notesList.textContent = "No notes found.";
    } else {
        notesList.innerHTML = allCards;
    }
}

// ---------- 8. Dark mode ----------
function toggleTheme() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.textContent = "Light Mode";
    } else {
        themeBtn.textContent = "Dark Mode";
    }
}

// ---------- 9. Events ----------
saveBtn.addEventListener("click", saveNote);
cancelBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", showNotes);
themeBtn.addEventListener("click", toggleTheme);

// show saved notes when the page opens
showNotes();