import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { SidebarContext } from "../context/SidebarContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { toggleSidebar } = useContext(SidebarContext);
  const navigate = useNavigate();

  return (
    <nav style={{
      background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
      color: "#fff",
      padding: isAuthenticated ? "0 20px" : "0 20px",
      height: "60px",
      display: "flex",
      justifyContent: isAuthenticated ? "flex-start" : "space-between",
      alignItems: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      {/* Authenticated - Toggle + Logo + App Name */}
      {isAuthenticated && (
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button
            onClick={toggleSidebar}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "none",
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "18px",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              fontWeight: "600"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            title="Toggle sidebar"
          >
            ☰
          </button>
          
          <h1 style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#fff"
          }}
          onClick={() => navigate("/")}
          >
            📝 Collab Note
          </h1>
        </div>
      )}

      {/* Not authenticated - Show logo and auth buttons */}
      {!isAuthenticated && (
        <>
          <h1 style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#fff"
          }}
          onClick={() => navigate("/login")}
          >
            📝 Collab Note
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "8px 16px",
                background: "#3498db",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#2980b9";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#3498db";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              🔐 Login
            </button>
            <button
              onClick={() => navigate("/register")}
              style={{
                padding: "8px 16px",
                background: "#27ae60",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#229954";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#27ae60";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              ✍️ Sign Up
            </button>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;