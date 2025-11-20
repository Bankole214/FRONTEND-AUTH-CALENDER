// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   Alert,
//   Paper,
// } from "@mui/material";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess(false);

//     // Validation
//     if (
//       !formData.firstName ||
//       !formData.lastName ||
//       !formData.email ||
//       !formData.password
//     ) {
//       setError("Please fill in all fields");
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError("Password must be at least 6 characters long");
//       return;
//     }

//     // Check if user already exists
//     const users = JSON.parse(localStorage.getItem("users") || "[]");
//     const existingUser = users.find((u) => u.email === formData.email);

//     if (existingUser) {
//       setError("User with this email already exists");
//       return;
//     }

//     // Save new user
//     const newUser = {
//       id: Date.now(),
//       firstName: formData.firstName,
//       lastName: formData.lastName,
//       email: formData.email,
//       password: formData.password,
//     };

//     users.push(newUser);
//     localStorage.setItem("users", JSON.stringify(users));

//     // Show success message and redirect after delay
//     setSuccess(true);

//     setTimeout(() => {
//       // Auto-login after registration
//       localStorage.setItem("authToken", "dummy-token");
//       localStorage.setItem("currentUser", JSON.stringify(newUser));
//       navigate("/dashboard");
//     }, 2000);
//   };

//   if (success) {
//     return (
//       <Box className="auth-container">
//         <Paper
//           elevation={3}
//           sx={{ p: 4, maxWidth: 400, width: "100%", textAlign: "center" }}>
//           <Typography variant="h4" component="h1" gutterBottom color="primary">
//             🎉 Registration Successful!
//           </Typography>
//           <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
//             Welcome, {formData.firstName} {formData.lastName}!
//           </Typography>
//           <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
//             Your account has been created successfully. You will be redirected
//             to your dashboard shortly.
//           </Typography>
//           <Box sx={{ mt: 2 }}>
//             <Typography variant="body2" color="text.secondary">
//               Redirecting...
//             </Typography>
//           </Box>
//         </Paper>
//       </Box>
//     );
//   }

//   return (
//     <Box className="auth-container">
//       <Box className="auth-form">
//         <Typography variant="h4" component="h1" gutterBottom>
//           Register
//         </Typography>

//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         <form onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             label="First Name"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             margin="normal"
//             required
//           />

//           <TextField
//             fullWidth
//             label="Last Name"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//             margin="normal"
//             required
//           />

//           <TextField
//             fullWidth
//             label="Email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             margin="normal"
//             required
//           />

//           <TextField
//             fullWidth
//             label="Password"
//             name="password"
//             type="password"
//             value={formData.password}
//             onChange={handleChange}
//             margin="normal"
//             required
//           />

//           <TextField
//             fullWidth
//             label="Confirm Password"
//             name="confirmPassword"
//             type="password"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             margin="normal"
//             required
//           />

//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 3, mb: 2 }}>
//             Register
//           </Button>

//           <Box textAlign="center">
//             <Typography variant="body2">
//               Already have an account? <Link to="/login">Login here</Link>
//             </Typography>
//           </Box>
//         </form>
//       </Box>
//     </Box>
//   );
// };

// export default Register;



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate password in real-time
    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("At least 8 characters");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("One lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("One uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("One number");
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push("One special character (@$!%*?&)");
    }

    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

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

    if (!validatePassword(formData.password)) {
      setError("Please fix password requirements");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
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

    // Show success message and redirect after delay
    setSuccess(true);

    setTimeout(() => {
      // Auto-login after registration
      localStorage.setItem("authToken", "dummy-token");
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      navigate("/dashboard");
    }, 2000);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: "", color: "grey" };
    if (password.length < 8) return { strength: "Weak", color: "red" };

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

    const requirementsMet = [hasLower, hasUpper, hasNumber, hasSpecial].filter(
      Boolean
    ).length;

    if (requirementsMet === 4) return { strength: "Strong", color: "green" };
    if (requirementsMet >= 2) return { strength: "Medium", color: "orange" };
    return { strength: "Weak", color: "red" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (success) {
    return (
      <Box className="auth-container">
        <Paper
          elevation={3}
          sx={{ p: 4, maxWidth: 400, width: "100%", textAlign: "center" }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            🎉 Registration Successful!
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Welcome, {formData.firstName} {formData.lastName}!
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
            Your account has been created successfully. You will be redirected
            to your dashboard shortly.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Redirecting...
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

          <FormControl fullWidth margin="normal">
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {formData.password && (
              <FormHelperText sx={{ color: passwordStrength.color }}>
                Password Strength: {passwordStrength.strength}
              </FormHelperText>
            )}
            {passwordErrors.length > 0 && (
              <FormHelperText error>
                Password must contain:
                <Box component="ul" sx={{ mt: 0.5, mb: 0, pl: 2 }}>
                  {passwordErrors.map((error, index) => (
                    <li key={index} style={{ fontSize: "0.75rem" }}>
                      {error}
                    </li>
                  ))}
                </Box>
              </FormHelperText>
            )}
          </FormControl>

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            error={
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword
            }
            helperText={
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword
                ? "Passwords do not match"
                : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={passwordErrors.length > 0}>
            Register
          </Button>

          <Box textAlign="center">
            <Typography variant="body2">
              Already have an account? <Link to="/login">Login here</Link>
            </Typography>
          </Box>
        </form>

        {/* Password Requirements Info */}
        <Paper elevation={1} sx={{ p: 2, mt: 2, backgroundColor: "#f5f5f5" }}>
          <Typography variant="subtitle2" gutterBottom>
            🔒 Password Requirements:
          </Typography>
          <Typography variant="caption" component="div">
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              <li>Minimum 8 characters</li>
              <li>At least one uppercase letter (A-Z)</li>
              <li>At least one lowercase letter (a-z)</li>
              <li>At least one number (0-9)</li>
              <li>At least one special character (@$!%*?&)</li>
            </ul>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Register;