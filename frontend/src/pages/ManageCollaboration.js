import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getNotes, updateNote, getCollaborators, updateCollaborator } from "../api/notes";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const ManageCollaboration = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedNote, setExpandedNote] = useState(null);
  const [noteCollaborators, setNoteCollaborators] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchNotes();
  }, [isAuthenticated, navigate]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await getNotes();
      setNotes(res.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load notes");
      console.error("Fetch notes error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccessibilityChange = async (noteId, newStatus) => {
    try {
      await updateNote(noteId, { isPublic: newStatus });
      setNotes(notes.map(n => n._id === noteId ? { ...n, isPublic: newStatus } : n));
      alert(`Note ${newStatus ? "made public" : "made private"}!`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update accessibility");
    }
  };

  // Fetch collaborators for a note
  const fetchCollaboratorsForNote = async (noteId) => {
    try {
      const res = await getCollaborators(noteId);
      setNoteCollaborators(prev => ({
        ...prev,
        [noteId]: res.data || []
      }));
    } catch (err) {
      console.error("Failed to fetch collaborators:", err);
      setError("Failed to fetch collaborators");
    }
  };

  // Handle role change
  const handleRoleChange = async (noteId, collaboratorId, newRole) => {
    try {
      await updateCollaborator(noteId, collaboratorId, newRole);
      
      // Update local state
      setNoteCollaborators(prev => ({
        ...prev,
        [noteId]: prev[noteId].map(collab =>
          collab._id === collaboratorId ? { ...collab, role: newRole } : collab
        )
      }));
      
      alert("Collaborator role updated!");
    } catch (err) {
      console.error("Failed to update role:", err);
      setError(err.response?.data?.message || "Failed to update collaborator role");
    }
  };

  // Auto-fetch collaborators when expandedNote changes
  useEffect(() => {
    if (expandedNote && !noteCollaborators[expandedNote]) {
      fetchCollaboratorsForNote(expandedNote);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedNote]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "40px 20px", textAlign: "center", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div>
            <p style={{ fontSize: "16px", color: "#2c3e50", fontWeight: "500" }}>📂 Loading your notes...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "30px 20px", maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ marginBottom: "30px" }}>
            <h1 style={{ color: "#2c3e50", margin: "0 0 10px 0", fontSize: "28px" }}>📋 Manage Collaboration</h1>
            <p style={{ color: "#7f8c8d", margin: "0", fontSize: "14px" }}>View and manage collaborators for each of your notes</p>
          </div>

          {error && (
            <div style={{
              background: "#ffebee",
              color: "#c62828",
              padding: "14px 16px",
              borderRadius: "6px",
              marginBottom: "20px",
              border: "1px solid #ef9a9a",
              fontSize: "14px"
            }}>
              ⚠️ {error}
            </div>
          )}

          {notes.length === 0 ? (
            <div style={{
              background: "#f5f6fa",
              padding: "30px",
              borderRadius: "8px",
              textAlign: "center",
              color: "#7f8c8d"
            }}>
              <p>No notes found. Create a note to manage collaboration.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {notes.map((note) => (
                <div
                  key={note._id}
                  style={{
                    background: "#fff",
                    border: "1px solid #ecf0f1",
                    borderRadius: "8px",
                    padding: "15px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)"
                  }}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    userSelect: "none"
                  }}
                  onClick={() => setExpandedNote(expandedNote === note._id ? null : note._id)}
                  >
                    <div>
                      <h3 style={{ margin: "0 0 5px 0", color: "#2c3e50" }}>
                        {note.title}
                      </h3>
                      <p style={{ margin: "0", fontSize: "12px", color: "#7f8c8d" }}>
                        {note.isPublic ? "🌐 Public" : "🔒 Private"}
                      </p>
                    </div>
                    <span style={{ fontSize: "18px", color: "#3498db" }}>
                      {expandedNote === note._id ? "▼" : "▶"}
                    </span>
                  </div>

                  {expandedNote === note._id && (
                    <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #ecf0f1" }}>
                      {/* Accessibility Toggle */}
                      <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={note.isPublic}
                            onChange={(e) => handleAccessibilityChange(note._id, e.target.checked)}
                            style={{ cursor: "pointer" }}
                          />
                          <span style={{ fontSize: "14px", color: "#2c3e50" }}>
                            {note.isPublic ? "Anyone can view this note with link" : "Only collaborators can view"}
                          </span>
                        </label>
                      </div>

                      {/* Collaborators Info */}
                      <div>
                        <p style={{ margin: "0 0 10px 0", fontSize: "12px", fontWeight: "600", color: "#7f8c8d" }}>
                          👥 COLLABORATORS
                        </p>
                        <div style={{
                          background: "#f5f6fa",
                          padding: "12px",
                          borderRadius: "4px",
                          color: "#2c3e50"
                        }}>
                          {noteCollaborators[note._id]?.length > 0 ? (
                            noteCollaborators[note._id].map((collab, idx) => (
                              <div key={idx} style={{ marginBottom: "10px", paddingBottom: "10px", borderBottom: idx < noteCollaborators[note._id].length - 1 ? "1px solid #ecf0f1" : "none" }}>
                                <p style={{ margin: "0 0 4px 0", fontSize: "13px", fontWeight: "600" }}>
                                  ✓ {collab.user?.name || "Unknown"}
                                </p>
                                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#7f8c8d" }}>
                                  📧 {collab.user?.email || "No email"}
                                </p>
                                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                  <label style={{ fontSize: "11px", fontWeight: "600", color: "#3498db" }}>
                                    Role:
                                  </label>
                                  {note.owner && user && (user.id === (note.owner._id || note.owner)) ? (
                                    <select
                                      value={collab.role}
                                      onChange={(e) => handleRoleChange(note._id, collab._id, e.target.value)}
                                      style={{
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                        border: "1px solid #ddd",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                        backgroundColor: "#fff"
                                      }}
                                    >
                                      <option value="viewer">Viewer</option>
                                      <option value="editor">Editor</option>
                                      <option value="owner">Owner</option>
                                    </select>
                                  ) : (
                                    <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>{collab.role}</span>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p style={{ margin: "0", opacity: 0.7, fontSize: "13px" }}>No collaborators yet</p>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => navigate(`/editor/${note._id}`)}
                          style={{
                            padding: "8px 12px",
                            background: "#3498db",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "600"
                          }}
                        >
                          Edit Note
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageCollaboration;
