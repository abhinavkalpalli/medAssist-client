import React, { useState } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import './AdminSignup.css';
import { adminRegister } from "../../services/admin/apiMethods";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      toast.error('Invalid email address');
      return;
    }
    if (password !== reEnterPassword) {
      setError("Passwords don't match");
      toast.error("Passwords don't match");
      return;
    }
    try {
      const response = await adminRegister({ email, password });
      if (response.status === 201) {
        const { email, otp } = response.data;
        const isAdmin = true;
        navigate('/otp-verification', { state: { email, otp, isAdmin } });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error?.response?.message || error?.message || "An error occurred");
    }
  };

  return (
    <Container component="main" maxWidth="lg" className="signup-container">
      <CssBaseline />
      <Grid container spacing={0}>
        <Grid
          item
          xs={12}
          sm={4}
          className="signup-image"
        />
        <Grid
          item
          xs={12}
          sm={8}
          component={Paper}
          elevation={6}
          square
          className="signup-form-container"
        >
          <Box sx={{ p: 3 }}>
            <Typography component="h1" variant="h5" className="signup-title">
              Admin Sign Up
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleOnSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error && error.includes("email")}
                helperText={error.includes("email") ? error : ""}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!error && error.includes("Passwords")}
                helperText={error.includes("Passwords") ? error : ""}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="reEnterPassword"
                label="Re-enter Password"
                type="password"
                id="reEnterPassword"
                autoComplete="current-password"
                value={reEnterPassword}
                onChange={(e) => setReEnterPassword(e.target.value)}
                error={!!error && error.includes("Passwords")}
                helperText={error.includes("Passwords") ? error : ""}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="signup-submit"
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/admin/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
