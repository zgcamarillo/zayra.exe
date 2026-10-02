import { useState } from "react";

function Notes() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("zayra-notes");

    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [selectedNoteId, setSelectedNoteId] =
    useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const saveNotes = (updatedNotes) => {
    setNotes(updatedNotes);

    localStorage.setItem(
      "zayra-notes",
      JSON.stringify(updatedNotes)
    );
  };

  const createNewNote = () => {
    setSelectedNoteId(null);
    setNoteTitle("");
    setNoteContent("");
  };

  const handleSelectNote = (note) => {
    setSelectedNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
  };

  const handleSaveNote = (event) => {
    event.preventDefault();

    if (!noteTitle.trim() && !noteContent.trim()) {
      return;
    }

    const now = new Date().toLocaleString();

    if (selectedNoteId !== null) {
      const updatedNotes = notes.map((note) =>
        note.id === selectedNoteId
          ? {
              ...note,
              title:
                noteTitle.trim() || "Untitled Note",
              content: noteContent,
              updatedAt: now,
            }
          : note
      );

      saveNotes(updatedNotes);
      return;
    }

    const newNote = {
      id: Date.now(),
      title:
        noteTitle.trim() || "Untitled Note",
      content: noteContent,
      updatedAt: now,
    };

    saveNotes([newNote, ...notes]);

    setSelectedNoteId(newNote.id);
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = notes.filter(
      (note) => note.id !== noteId
    );

    saveNotes(updatedNotes);

    if (selectedNoteId === noteId) {
      setSelectedNoteId(null);
      setNoteTitle("");
      setNoteContent("");
    }
  };

  const filteredNotes = notes.filter((note) => {
    const search = searchTerm.toLowerCase();

    return (
      note.title.toLowerCase().includes(search) ||
      note.content.toLowerCase().includes(search)
    );
  });

  return (
    <section className="notes-page">
      <div className="notes-header">
        <div>
          <p className="eyebrow">
            ♡ YOUR LITTLE CORNER
          </p>

          <h2>
            My Notes
          </h2>

          <p className="notes-subtitle">
            organized-ish ♡
          </p>
        </div>

        <button
          className="new-note-button"
          onClick={createNewNote}
        >
          + New Note
        </button>
      </div>

      <div className="notes-layout">
        <aside className="dashboard-card notes-sidebar">
          <div className="notes-sidebar-top">
            <p className="card-label">
              MY NOTES
            </p>

            <span>
              {notes.length}
            </span>
          </div>

          <div className="notes-search">
            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />
          </div>

          {filteredNotes.length === 0 ? (
            <div className="notes-list-empty">
              <span>
                ♡
              </span>

              <p>
                {notes.length === 0
                  ? "No notes yet."
                  : "No notes found."}
              </p>
            </div>
          ) : (
            <div className="notes-list">
              {filteredNotes.map((note) => (
                <button
                  className={
                    selectedNoteId === note.id
                      ? "note-preview selected"
                      : "note-preview"
                  }
                  key={note.id}
                  onClick={() =>
                    handleSelectNote(note)
                  }
                >
                  <strong>
                    {note.title}
                  </strong>

                  <span>
                    {note.content
                      ? note.content.slice(
                          0,
                          55
                        )
                      : "No content yet..."}
                  </span>

                  <small>
                    {note.updatedAt}
                  </small>
                </button>
              ))}
            </div>
          )}
        </aside>

        <div className="dashboard-card note-editor">
          <form onSubmit={handleSaveNote}>
            <div className="note-editor-top">
              <span className="card-label">
                {selectedNoteId !== null
                  ? "EDITING NOTE"
                  : "NEW NOTE"}
              </span>

              {selectedNoteId !== null && (
                <button
                  type="button"
                  className="note-delete"
                  onClick={() =>
                    handleDeleteNote(
                      selectedNoteId
                    )
                  }
                >
                  Delete
                </button>
              )}
            </div>

            <input
              className="note-title-input"
              type="text"
              placeholder="Note title..."
              value={noteTitle}
              onChange={(event) =>
                setNoteTitle(
                  event.target.value
                )
              }
            />

            <textarea
              className="note-content-input"
              placeholder="Write whatever is on your mind..."
              value={noteContent}
              onChange={(event) =>
                setNoteContent(
                  event.target.value
                )
              }
            />

            <div className="note-editor-bottom">
              <span>
                {selectedNoteId !== null
                  ? "Your note is saved locally ♡"
                  : "A little space just for you ♡"}
              </span>

              <button
                className="save-note-button"
                type="submit"
              >
                {selectedNoteId !== null
                  ? "Save Changes ✨"
                  : "Save Note ✨"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Notes;