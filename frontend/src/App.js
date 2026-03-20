import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateNote from "./pages/CreateNote";
import Editor from "./pages/Editor";
import PublicView from "./pages/PublicView";
import ManageCollaboration from "./pages/ManageCollaboration";

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

// Public Route - redirect to dashboard if already logged in
const PublicRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return element;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/register" element={<PublicRoute element={<Register />} />} />
        
        {/* Public View - accessible to everyone */}
        <Route path="/public/:token" element={<PublicView />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/create" element={<ProtectedRoute element={<CreateNote />} />} />
        <Route path="/editor/:id" element={<ProtectedRoute element={<Editor />} />} />
        <Route path="/manage-collaboration" element={<ProtectedRoute element={<ManageCollaboration />} />} />

        {/* Catch-all - redirect to home or login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;