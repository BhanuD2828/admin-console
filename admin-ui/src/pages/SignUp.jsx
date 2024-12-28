import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import SnackbarComponent from "../components/Snackbar";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phone: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // Can be 'success', 'error', 'warning', 'info'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear the error for the specific field
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = "User Name is required.";
    }
    if (!formData.firstname.trim()) {
      errors.firstname = "First Name is required.";
    }
    if (!formData.lastname.trim()) {
      errors.lastname = "Last Name is required.";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required.";
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      // Signp an API call
      const response = await fetch("http://localhost:8000/api/v1/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to register. Please try again.");
      }

      const result = await response.json();
      console.log(result);

      // Show success message and redirect to dashboard
      setSnackbar({
        open: true,
        message: result.message || "Registration successful!",
        severity: "success",
      });

      // Redirect to dashboard after success
      setTimeout(() => {
        navigate(`/otp?email=${formData.email}`);
      }, 1500);
    } catch (error) {
      // Show error message in snackbar
      setSnackbar({
        open: true,
        message: error.message || "An error occurred. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{
        backgroundImage: "url('https://source.unsplash.com/random/1920x1080')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      ></Box>

      {/* Sign Up Card */}
      <Paper
        sx={{
          position: "relative",
          zIndex: 2,
          padding: "40px",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Centered Logo */}
        <Box
          sx={{
            position: "absolute",
            top: "-50px", // Moves half-outside
            left: "50%",
            transform: "translate(-50%, 0)",
            backgroundColor: "#001a99",
            color: "white",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
          }}
        >
          <AccountCircleIcon fontSize="small" sx={{ fontSize: "50px" }} />
        </Box>

        <Box mt={3}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Register
          </Typography>

          <TextField
            required
            variant="outlined"
            fullWidth
            label="First Name"
            name="firstname"
            value={formData.firstname}
            error={!!formErrors.firstname}
            helperText={formErrors.firstname}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            required
            variant="outlined"
            fullWidth
            label="Last Name"
            name="lastname"
            value={formData.lastname}
            error={!!formErrors.lastname}
            helperText={formErrors.lastname}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            required
            variant="outlined"
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            error={!!formErrors.username}
            helperText={formErrors.username}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            required
            variant="outlined"
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            error={!!formErrors.email}
            helperText={formErrors.email}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            required
            variant="outlined"
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            error={!!formErrors.phone}
            helperText={formErrors.phone}
            onChange={handleChange}
            sx={{ marginBottom: 1 }}
          />

          <Typography mt={2} variant="body2" color="gray">
            Already have an account?{" "}
            <span
              style={{ color: "#001a99", cursor: "pointer" }}
              onClick={handleNavigateToLogin}
            >
              Login
            </span>
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              marginTop: 3,
              backgroundColor: "#001a99",
              color: "white",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#0026d1" },
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Paper>

      {/* Snackbar for alerts */}
      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default SignUp;
