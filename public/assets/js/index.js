const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

let currentNote = {};

const getNotes = () => {

    return $.ajax({
        url: "/api/notes",
        method: "GET"
    }).fail((err) => {
        console.err(err)
    });

};

const saveNote = (note) => {
    return $.ajax({
        url: "/api/notes",
        method: "POST",
        data: note
    }).fail((err) => {
        console.err(err.responseJSON)
    });
};

const deleteNote = (id) => {
    return $.ajax({
        url: "api/notes/" + id,
        method: "DELETE"
    }).fail((err) => {
        console.err(err.responseJSON)
    });
};

const renderCurrentNote = () => {
    $saveNoteBtn.hide();

    if (currentNote.id) {

        $noteTitle.attr("readonly", true);
        $noteText.attr("readonly", true);
        $noteTitle.val(currentNote.title);
        $noteText.val(currentNote.text);

    } else {

        $noteTitle.attr("readonly", false);
        $noteText.attr("readonly", false);
        $noteTitle.val("");
        $noteText.val("");

    }

};

handleSave = () => {
    const newNote = {
        title: $noteTitle.val(),
        text: $noteText.val()
    };

    saveNote(newNote).then(() => {
        getAndRender();
        renderCurrentNote();
    })
};

const viewNewNote = () => {
    currentNote = {};
    renderCurrentNote();
};

const handleSave = function () {
    if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
        $saveNoteBtn.hide();
    } else {
        $saveNoteBtn.show();
    }
};

const handleDelete = function (event) {

    event.stopPropagation();

    const note = $(this).parent('.list-group-item').data();

    if (currentNote.id === note.id) {
        currentNote = {};
    }

    deleteNote(note.id).then(() => {
        getAndRender();
        renderCurrentNote();
    })

}

renderNoteTitles = (notes) => {
    $noteList.empty();

    const noteTitles = [];

    const create$li = (text, useDeleteBtn = true) => {

        const $li = $(`<li class= 'list-group-item'>`);
        const $span = $(`<span>`).text(text);
        $li.append($span);

        if (useDeleteBtn) {
            const $deleteBtn = $(`i class= 'fas fa-trash-alt float-right delete-note`);
            $li.append
                ($deleteBtn)
        }

        return $li;

    };

    if (notes.length === 0) {
        noteTitles.push(create$li(`No Notes Found`, false));
    };

    notes.forEach(note => {

        const $li = create$li(note.title).data(note);
        noteTitles.push($li);

    });
};

const getAndRender = () => {

    return getNotes().then(renderNoteTitles);

};

$saveNoteBtn.on('click', handleSave);
$noteList.on('click', '.list-group-item', viewNewNote);
$noteList.on('click', '.delete-note', handleDelete);
$noteTitle.on('keyup', handleSave);
$noteText.on('keyup', handleSave)

getAndRender();