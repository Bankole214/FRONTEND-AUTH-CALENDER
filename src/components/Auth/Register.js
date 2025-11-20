import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.find((u) => u.email === formData.email);

    if (existingUser) {
      setError("User with this email already exists");
      return;
    }

    // Save new user
    const newUser = {
      id: Date.now(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Auto-login after registration
    localStorage.setItem("authToken", "dummy-token");
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    navigate("/dashboard");
  };

  return (
    <Box className="auth-container">
      <Box className="auth-form">
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            margin="normal"
            required
          />

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

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Register
          </Button>

          <Box textAlign="center">
            <Typography variant="body2">
              Already have an account? <Link to="/login">Login here</Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Register;