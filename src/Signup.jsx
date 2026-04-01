import { useState } from "react";
import axios from "axios";

export default function Signup({ onSignup, goToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleSignup = async () => {
  try {
    await axios.post(
      "http://localhost:5000/api/auth/signup",
      {
        email,
        password
      }
    );

    alert("Signup successful. Please login to continue.");
    onSignup();
  } catch (err) {
    const message = err.response?.data?.message || "Signup failed";
    alert(message);
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
        <h2>Signup</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <button onClick={handleSignup} style={{ width: "100%" }}>
          Signup
        </button>

        <p style={{ marginTop: 10 }}>
          Already have an account?{" "}
          <span style={{ color: "blue", cursor: "pointer" }} onClick={goToLogin}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}