import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { SidebarContext } from "../context/SidebarContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useContext(SidebarContext);
  const { logout, user } = useContext(AuthContext);

  const menuItems = [
    { path: "/", label: "📚 Dashboard" },
    { path: "/create", label: "➕ Create Note" },
    { path: "/manage-collaboration", label: "🔗 Manage Collaboration" }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toggleSidebar();
    navigate("/login");
  };

  return (
    <aside style={{
      width: sidebarOpen ? "260px" : "0",
      background: "linear-gradient(180deg, #2c3e50 0%, #34495e 100%)",
      color: "#ecf0f1",
      minHeight: "calc(100vh - 60px)",
      padding: "0",
      boxSizing: "border-box",
      transition: "all 0.3s ease",
      overflow: "hidden",
      position: "fixed",
      top: "60px",
      left: "0",
      boxShadow: sidebarOpen ? "4px 0 12px rgba(0,0,0,0.15)" : "none",
      display: "flex",
      flexDirection: "column",
      zIndex: 999
    }}>


      {/* Menu Items */}
      <nav style={{ flex: 1, padding: "15px 0", overflowY: "auto" }}>
        {menuItems.map((item) => (
          <div
            key={item.path}
            onClick={() => {
              navigate(item.path);
              toggleSidebar();
            }}
            style={{
              padding: "14px 20px",
              cursor: "pointer",
              background: isActive(item.path) ? "rgba(52, 152, 219, 0.3)" : "transparent",
              borderLeft: isActive(item.path) ? "4px solid #3498db" : "4px solid transparent",
              color: isActive(item.path) ? "#3498db" : "#ecf0f1",
              transition: "all 0.3s ease",
              fontSize: "15px",
              fontWeight: isActive(item.path) ? "600" : "400"
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {item.label}
          </div>
        ))}
      </nav>

      {/* Bottom Section - User Info & Logout */}
      <div style={{
        padding: "15px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        textAlign: "center"
      }}>
        {/* User Info */}
        <div style={{ marginBottom: "12px" }}>
          <p style={{ margin: "0 0 5px 0", fontSize: "16px", fontWeight: "600", color: "#ecf0f1" }}>👤 {user?.name || "User"}</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "10px",
            background: "#e74c3c",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: "600",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#c0392b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#e74c3c";
          }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;