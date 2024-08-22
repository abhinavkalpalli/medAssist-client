import React, { useState } from "react";
import {
  Container,
  CssBaseline,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Link,
  FormHelperText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./ForgotPassword.css"; 
import { forgotpassword } from "../../services/patient/apiMethods";
import { doctorforgotpassword } from "../../services/doctor/apiMethods";
import { adminforgotpassword } from "../../services/admin/apiMethods";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isDoctor = params.get('isDoctor') === 'true';
  const isAdmin = params.get('isAdmin') === 'true';
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if(isDoctor){
        const response=await doctorforgotpassword({email})
        if(response.status===200){
          const {email,otp}=response.data
          navigate('/otp-verification',{state:{email,otp,passwordReset:true,isDoctor:true}})
        }
        setSuccess("Password reset email sent! Check your inbox.");
        setError("");
      }
      else if(isAdmin){
        const response=await adminforgotpassword({email})
        if(response.status===200){
          const {email,otp,isAdmin}=response.data
          navigate('/otp-verification',{state:{email,otp,passwordReset:true,isAdmin}})
        }
      }
        else{
        const response=await forgotpassword({email})
        if(response.status==200){
          const {email,otp}=response.data
          navigate('/otp-verification',{state:{email,otp,passwordReset:true}})
        }
        setSuccess("Password reset email sent! Check your inbox.");
        setError("");
      }
     
    } catch (err) {
      setError("Failed to send password reset email. Please try again.");
      setSuccess("");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={6} className="forgot-password-paper">
        <Box className="forgot-password-box">
          <Typography component="h1" variant="h5" className="forgot-password-title">
            Forgot Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
              error={!!error}
              helperText={error}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
              className="forgot-password-button"
            >
              Send Otp
            </Button>
            {success && (
              <FormHelperText error={false} className="forgot-password-success">
                {success}
              </FormHelperText>
            )}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Remember your password? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
