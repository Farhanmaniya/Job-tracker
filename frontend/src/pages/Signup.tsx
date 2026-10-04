import { useState } from "react";
import "./Auth.css";
import api from "../api/client";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        try {
            await api.post("/auth/signup", { name, email, password });
            // for now, just confirm it worked - we'll redirect to login once that page exists
            navigate("/login");
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message);
            } else {
                setError("Something Went Wrong");
            }
        }
    }

    return (
        <div className="auth-page">
            <h1>Sign up</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name
                    <input value={name} onChange={(e) => setName(e.target.value)} required />
                </label>

                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>

                <label>
                    Password
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>

                {error && <p className="error">{error}</p>}

                <button type="submit">Create Account</button>
                <p>Already have an account? <Link to="/signup">Log in</Link></p>
                <p className="legal-links">
                    <Link to='/privacy'>Privacy Policy</Link> · <Link to="/terms">Terms & Conditions</Link>
                </p>
            </form>
        </div>
    );
}

export default Signup;