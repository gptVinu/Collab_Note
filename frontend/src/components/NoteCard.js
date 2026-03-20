const NoteCard = ({ note, onEdit, onDelete, currentUserId }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Check if current user is the owner
  const isOwner = currentUserId === note.owner?._id || currentUserId === note.owner;

  return (
    <div
      className="card"
      onClick={onEdit}
      style={{
        background: "white",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "15px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        cursor: "pointer",
        transition: "all 0.3s ease"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>
            {note.title || "Untitled Note"}
          </h3>
          <p style={{
            margin: "0 0 10px 0",
            color: "#666",
            fontSize: "14px",
            lineHeight: "1.4"
          }}>
            {note.content ? note.content.slice(0, 100) : "No content"}
            {note.content && note.content.length > 100 ? "..." : ""}
          </p>

          <div style={{ display: "flex", gap: "15px", fontSize: "12px", color: "#999", flexWrap: "wrap" }}>
            {note.timestamps?.updatedAt && (
              <span>📅 {formatDate(note.timestamps.updatedAt)}</span>
            )}
            {note.owner && (
              <span>👤 Owner: {note.owner?.name || "Unknown"}</span>
            )}
            {note.isPublic && (
              <span style={{ color: "#2196F3" }}>🔗 Public</span>
            )}
          </div>
        </div>

        {isOwner && (
          <button
            onClick={onDelete}
            style={{
              padding: "8px 12px",
              background: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              marginLeft: "10px"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#c0392b";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#e74c3c";
            }}
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteCard;