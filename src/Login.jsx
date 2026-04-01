import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin, goToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async () => {
  try {
    const res = await axios.post(
      "https://focus-backend-vj3r.onrender.com/api/auth/login",
      {
        email,
        password
      }
    );

    localStorage.setItem("token", res.data.token);
    onLogin(res.data.token);

  } catch (err) {
    alert("Login failed");
  }
};
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #6366F1, #8B5CF6)"
    }}>
      <div style={{
        background: "white",
        padding: 30,
        borderRadius: 12,
        width: 300,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <button onClick={handleLogin} style={{ width: "100%" }}>
          Login
        </button>

        <p style={{ marginTop: 10 }}>
          Don&apos;t have an account?{" "}
          <span style={{ color: "blue", cursor: "pointer" }} onClick={goToSignup}>
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}
