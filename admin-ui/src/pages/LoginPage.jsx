import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import videoBg from "../assets/bgvideo.mp4";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = "Username is required.";
    }
    // Password Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!formData.password.trim()) {
      errors.password = "Password is required.";
    } else if (!passwordRegex.test(formData.password)) {
      errors.password =
        "Password must include a mix of a-z, A-Z, 0-9, special characters, and be at least 8 characters long.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.detail,
          severity: "error",
        });
        return;
      }

      const { access_token, user_id } = await response.json();

      localStorage.setItem("authToken", access_token);
      localStorage.setItem("user_id", user_id);

      setSnackbar({
        open: true,
        message: "Login successful!",
        severity: "success",
      });

      setTimeout(() => {
        login(formData.username);
        navigate("/");
      }, 1000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "An error occurred. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleNavigateToSignup = () => {
    navigate("/signup");
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src={videoBg} autoPlay loop muted />
        Your browser does not support the video tag.
      </video>

      {/* Login Card */}
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
        <Box
          sx={{
            position: "absolute",
            top: "-50px",
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
            Login
          </Typography>

          {/* Username Field */}
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={!!formErrors.username}
            helperText={formErrors.username}
            sx={{ marginBottom: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Password Field */}
          <TextField
            variant="outlined"
            fullWidth
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
            sx={{ marginBottom: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Login Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              backgroundColor: "#001a99",
              color: "white",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#0026d1" },
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Register Link */}
          <Typography mt={2} variant="body2" color="gray">
            Don’t have an account?{" "}
            <span
              style={{ color: "#001a99", cursor: "pointer" }}
              onClick={handleNavigateToSignup}
            >
              Register User
            </span>
          </Typography>
        </Box>
      </Paper>

      {/* Snackbar for Alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
