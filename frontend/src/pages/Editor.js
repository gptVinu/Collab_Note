import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNotes, updateNote, addCollaborator, shareNote, getCollaborators } from "../api/notes";
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const socket = io("https://collab-note-backend.onrender.com");

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [collaboratorInput, setCollaboratorInput] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [shareLoading, setShareLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);


  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const fetchNote = async () => {
      try {
        setLoading(true);
        const res = await getNotes();
        const currentNote = res.data.find(n => n._id === id);
        if (!currentNote) {
          setError("Note not found");
          navigate("/");
          return;
        }
        setNote(currentNote);
        setTitle(currentNote.title);
        setContent(currentNote.content || "");
        setLastSaved(currentNote.timestamps?.updatedAt);
        
        // Fetch collaborators
        const collabRes = await getCollaborators(id);
        setCollaborators(collabRes.data || []);
      } catch (err) {
        setError("Failed to load note");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
    // eslint-disable-next-line
  }, [id, isAuthenticated]);

  // Socket.IO setup for real-time collaboration
  useEffect(() => {
    if (!id) return;

    socket.emit("join_note", id);

    socket.on("receive_changes", (data) => {
      setContent(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  // Handle content changes with auto-save
  const handleContentChange = (e) => {
    const value = e.target.value;
    setContent(value);

    // Emit real-time changes to collaborators
    socket.emit("edit_note", { noteId: id, content: value });

    // Auto-save with debounce
    setSaving(true);
    setTimeout(() => {
      updateNote(id, { content: value }).then(() => {
        setSaving(false);
        setLastSaved(new Date().toLocaleTimeString());
      }).catch(err => {
        setSaving(false);
        console.error("Save error:", err);
      });
    }, 1000);
  };

  // Handle title changes
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    // Auto-save title with debounce
    setSaving(true);
    setTimeout(() => {
      updateNote(id, { title: value }).then(() => {
        setSaving(false);
        setLastSaved(new Date().toLocaleTimeString());
      }).catch(err => {
        setSaving(false);
        console.error("Save error:", err);
      });
    }, 1000);
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Add collaborator
  const handleAddCollaborator = async () => {
    if (!collaboratorInput.trim()) {
      setError("Please enter a user email or ID");
      return;
    }

    // Validate email format if input contains @
    if (collaboratorInput.includes("@") && !isValidEmail(collaboratorInput)) {
      setError("Please enter a valid email address (e.g., user@example.com)");
      return;
    }

    try {
      const payload = {
        role: "editor",
      };

      // Detect if it's an email or userId
      if (collaboratorInput.includes("@")) {
        payload.email = collaboratorInput;
      } else {
        payload.userId = collaboratorInput;
      }

      await addCollaborator(id, payload);
      alert("✓ Collaborator added! They can now view this document when they login.");
      setCollaboratorInput("");
      setError("");
      
      // Refresh collaborators list
      const collabRes = await getCollaborators(id);
      setCollaborators(collabRes.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.response?.data?.message || "Failed to add collaborator";
      setError(errorMsg);
      console.error("Add collaborator error:", err);
    }
  };

  // Share note
  const handleShare = async () => {
    try {
      setShareLoading(true);
      const res = await shareNote(id);
      const shareLink = res.data.link || `${window.location.origin}/public/${res.data.publicToken}`;
      navigator.clipboard.writeText(shareLink);
      alert("Share link copied to clipboard!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate share link");
    } finally {
      setShareLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "20px" }}>Loading note...</div>
      </>
    );
  }

  if (error && !note) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "20px", color: "red" }}>{error}</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        {error && (
          <div style={{
            background: "#ffebee",
            color: "#c62828",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "15px"
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Note Title"
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                padding: "10px",
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxSizing: "border-box"
              }}
            />
          </div>
          <div style={{ marginLeft: "20px", display: "flex", gap: "10px" }}>
            <button
              onClick={handleShare}
              disabled={shareLoading}
              style={{
                padding: "10px 15px",
                background: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: shareLoading ? "not-allowed" : "pointer"
              }}
            >
              {shareLoading ? "⏳ Sharing..." : "🔗 Share"}
            </button>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "10px 15px",
                background: "#95a5a6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              ← Back
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "15px", fontSize: "12px", color: "#666" }}>
          {saving ? "💾 Saving..." : lastSaved && `✓ Last saved at ${lastSaved}`}
        </div>

        {/* Editor */}
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing your note content here..."
          style={{
            width: "100%",
            height: "60vh",
            padding: "15px",
            fontSize: "14px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            fontFamily: "monospace",
            resize: "vertical",
            boxSizing: "border-box"
          }}
        />

        {/* Collaborators Section */}
        <div style={{ marginTop: "30px", padding: "20px", background: "#f5f5f5", borderRadius: "4px" }}>
          <h3>👥 Add Collaborator</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Enter collaborator email or ID"
              value={collaboratorInput}
              onChange={(e) => setCollaboratorInput(e.target.value)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd"
              }}
            />
            <button
              onClick={handleAddCollaborator}
              style={{
                padding: "8px 15px",
                background: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Add
            </button>
          </div>

          {/* Display existing collaborators */}
          <div style={{ marginTop: "20px" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>Existing Collaborators</h4>
            {collaborators.length > 0 ? (
              <div style={{
                background: "white",
                padding: "15px",
                borderRadius: "4px",
                border: "1px solid #e0e0e0"
              }}>
                {collaborators.map((collab, idx) => (
                  <div key={idx} style={{
                    padding: "10px 0",
                    borderBottom: idx < collaborators.length - 1 ? "1px solid #ecf0f1" : "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontWeight: "600", color: "#2c3e50" }}>
                        {collab.user?.name || "Unknown User"}
                      </p>
                      <p style={{ margin: "0", fontSize: "13px", color: "#7f8c8d" }}>
                        {collab.user?.email || "No email"}
                      </p>
                    </div>
                    <span style={{
                      padding: "4px 12px",
                      background: "#e3f2fd",
                      color: "#1976d2",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      {collab.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#7f8c8d", fontSize: "14px" }}>No collaborators yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Editor;
