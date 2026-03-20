import { useState, useContext } from "react";
import { createNote } from "../api/notes";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const CreateNote = () => {
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await createNote(form);
      navigate(`/editor/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "40px 20px", maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#2c3e50", fontSize: "28px", margin: "0 0 10px 0" }}>📝 Create New Note</h2>
            <p style={{ color: "#7f8c8d", margin: "0", fontSize: "14px" }}>Start creating your new collaborative note</p>
          </div>

          {error && (
            <div style={{ 
              color: "#c62828", 
              marginBottom: "20px", 
              padding: "14px 16px", 
              background: "#ffebee", 
              borderRadius: "6px",
              fontSize: "14px",
              border: "1px solid #ef9a9a"
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{
            background: "#fff",
            border: "1px solid #ecf0f1",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2c3e50", fontSize: "14px" }}>Note Title</label>
              <input
                type="text"
                placeholder="Enter a catchy title for your note..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{
                  padding: "12px",
                  width: "100%",
                  boxSizing: "border-box",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = "#3498db"}
                onBlur={(e) => e.target.style.borderColor = "#ddd"}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2c3e50", fontSize: "14px" }}>Content here...</label>
              <textarea
                placeholder="Add your initial content here..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                style={{
                  padding: "12px",
                  width: "100%",
                  boxSizing: "border-box",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  minHeight: "120px",
                  resize: "vertical",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = "#3498db"}
                onBlur={(e) => e.target.style.borderColor = "#ddd"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                background: loading ? "#95a5a6" : "#27ae60",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#229954")}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#27ae60")}
            >
              {loading ? "Creating..." : "Create Note"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateNote;
