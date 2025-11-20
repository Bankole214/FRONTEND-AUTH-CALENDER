import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setSuccess(false);
    setLoading(true);

    // Simple validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (user) {
      setSuccess(true);
      setLoading(false);

      // Store authentication token
      localStorage.setItem("authToken", "dummy-token");
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Redirect after a short delay to show success message
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } else {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  // Show success page if login was successful
  if (success) {
    return (
      <Box className="auth-container">
        <Paper
          elevation={3}
          sx={{ p: 4, maxWidth: 400, width: "100%", textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            color="success.main">
            ✅ Login Successful!
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 2, color: "success.main" }}>
            Welcome Back!
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
            You have successfully logged in. Redirecting you to the dashboard...
          </Typography>
          <CircularProgress color="success" />
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Please wait while we redirect you...
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

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
            disabled={loading}
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
            disabled={loading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}>
            {loading ? <CircularProgress size={24} /> : "Login"}
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