import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

const PublicView = () => {
  const { token } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPublicNote = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get(`/notes/public/${token}`);
        setNote(res.data);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "Note not found or sharing link is invalid"
            : "Failed to load shared note"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPublicNote();
  }, [token]);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f5f6fa",
        fontSize: "18px",
        color: "#666"
      }}>
        📝 Loading shared note...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f5f6fa"
      }}>
        <div style={{
          background: "white",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: "500px"
        }}>
          <p style={{ fontSize: "18px", color: "#c62828", marginBottom: "15px" }}>
            ❌ {error}
          </p>
          <p style={{ color: "#666" }}>
            This note might have been deleted or the sharing link is no longer valid.
          </p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
        No note found
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f6fa",
      padding: "20px"
    }}>
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        background: "white",
        padding: "30px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{
            margin: "0 0 10px 0",
            color: "#333",
            fontSize: "32px"
          }}>
            {note.title || "Untitled Note"}
          </h1>
          
          {note.timestamps?.createdAt && (
            <p style={{ color: "#999", fontSize: "14px", margin: "0" }}>
              📅 Shared on {new Date(note.timestamps.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "4px",
          border: "1px solid #e0e0e0",
          minHeight: "300px",
          lineHeight: "1.6",
          color: "#333",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          fontFamily: "monospace"
        }}>
          {note.content || "No content"}
        </div>

        <div style={{
          marginTop: "20px",
          padding: "15px",
          background: "#e3f2fd",
          borderRadius: "4px",
          fontSize: "14px",
          color: "#1565c0"
        }}>
          ℹ️ This is a shared note. It is read-only.
        </div>
      </div>
    </div>
  );
};

export default PublicView;