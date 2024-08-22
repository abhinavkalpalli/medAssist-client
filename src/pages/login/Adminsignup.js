
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
import './Login.css';
import { adminRegister } from "../../services/admin/apiMethods";
import { useNavigate } from "react-router-dom";

export default function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [error, setError] = useState("");
  const navigate=useNavigate()

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      return;
    }

    const response=await adminRegister({email,password})
    if(response.status ===201){
      const {email,otp}=response.data
      const isAdmin=true
      navigate('/otp-verification',{state:{email,otp,isAdmin}})
    }
  };

  return (
    <Container component="main" maxWidth="lg" className="signup-container">
      <CssBaseline />
      <Grid container spacing={2}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          className="signup-image"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/48604/pexels-photo-48604.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          className="signup-form-container"
        >
          <Box className="signup-box">
            <Typography component="h1" variant="h5" className="signup-title">
              Sign up
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
                onChange={(e) => setEmail(e.target.value)}
                error={!!error}
                helperText={error}
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
                onChange={(e) => setPassword(e.target.value)}
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
                onChange={(e) => setReEnterPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="signup-button"
              >
                Sign Up
              </Button>
              <Grid container className="signup-link-container">
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
