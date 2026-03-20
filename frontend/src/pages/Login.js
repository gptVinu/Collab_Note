import { useState, useContext } from "react";
import { loginUser } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const res = await loginUser(form);
      login(res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "50px auto" }}>
      <h2>Login</h2>
      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input 
            type="email"
            placeholder="Email" 
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            style={{ padding: "8px", width: "100%", boxSizing: "border-box" }}
          />
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <input 
            type="password" 
            placeholder="Password" 
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            style={{ padding: "8px", width: "100%", boxSizing: "border-box" }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: "10px", 
            width: "100%", 
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "20px" }}>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default Login;