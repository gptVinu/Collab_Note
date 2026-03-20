import { useEffect, useState, useContext } from "react";
import { getNotes, searchNotes, deleteNote } from "../api/notes";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import NoteCard from "../components/NoteCard";

const Dashboard = () => {
  const [allNotes, setAllNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchNotes();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getNotes();
      setAllNotes(res.data);
      setFilteredNotes(res.data);
    } catch (err) {
      setError("Failed to load notes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search - filter notes as user types
  const handleSearch = async (value) => {
    setQuery(value);

    if (!value.trim()) {
      setFilteredNotes(allNotes);
      return;
    }

    try {
      const res = await searchNotes(value);
      setFilteredNotes(res.data);
    } catch (err) {
      console.error("Search error:", err);
      // Fallback to local filter
      setFilteredNotes(
        allNotes.filter(note =>
          note.title.toLowerCase().includes(value.toLowerCase()) ||
          note.content?.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  // Handle delete note
  const handleDeleteNote = async (noteId, e) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await deleteNote(noteId);
      setAllNotes(allNotes.filter(n => n._id !== noteId));
      setFilteredNotes(filteredNotes.filter(n => n._id !== noteId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete note");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <Sidebar />

        <div className="main">
          <div style={{ marginBottom: "30px" }}>
            <h2>📚 My Notes</h2>
            
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <input
                className="input"
                placeholder="🔍 Search notes by title or content..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px"
                }}
              />
              <button
                className="button"
                onClick={() => navigate("/create")}
                style={{
                  padding: "10px 20px",
                  background: "#4CAF50",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "4px"
                }}
              >
                ➕ New Note
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: "#ffebee",
              color: "#c62828",
              padding: "15px",
              borderRadius: "4px",
              marginBottom: "20px"
            }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>📝 Loading your notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "40px",
              background: "#f5f5f5",
              borderRadius: "8px",
              color: "#666"
            }}>
              <p style={{ fontSize: "18px", marginBottom: "10px" }}>
                {allNotes.length === 0 ? "No notes yet!" : "No notes matching your search"}
              </p>
              <p>
                {allNotes.length === 0
                  ? "Create your first note to get started"
                  : "Try a different search term"}
              </p>
              {allNotes.length === 0 && (
                <button
                  onClick={() => navigate("/create")}
                  style={{
                    marginTop: "15px",
                    padding: "10px 20px",
                    background: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Create First Note
                </button>
              )}
            </div>
          ) : (
            <div>
              <p style={{ color: "#666", marginBottom: "15px" }}>
                Showing {filteredNotes.length} of {allNotes.length} notes
              </p>
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onEdit={() => navigate(`/editor/${note._id}`)}
                  onDelete={(e) => handleDeleteNote(note._id, e)}
                  currentUserId={user?.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;