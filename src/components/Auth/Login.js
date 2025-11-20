import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (user) {
      // Store authentication token
      localStorage.setItem("authToken", "dummy-token");
        localStorage.setItem("currentUser", JSON.stringify(user));
        console.log("Login successful, navigating to dashboard");
        // navigate("/dashboard");
        window.location.href = "/dashboard";
    } else {
      setError("Invalid email or password");
    }
  };
    

  return (
    <Box className="auth-container">
      <Box className="auth-form">
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Login
          </Button>

          <Box textAlign="center">
            <Typography variant="body2">
              Don't have an account? <Link to="/register">Register here</Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
