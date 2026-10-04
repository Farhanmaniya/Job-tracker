import { useState } from "react";
import "./Auth.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import api from "../api/client";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message);
            } else {
                setError("Something went Wrong");
            }
        }
    }

    return (
        <div className="auth-page">
            <h1>Log in</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Password
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>

                {error && <p className="error">{error}</p>}

                <button type="submit">Log in</button>
                <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                <p className="legal-links">
                    <Link to='/privacy'>Privacy Policy</Link> · <Link to="/terms">Terms & Conditions</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;