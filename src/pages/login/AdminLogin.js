// src/pages/login/Login.js
import React, { useState,useEffect } from "react";
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
import { adminLogin } from "../../services/admin/apiMethods";
import { setAdmin } from "../../utils/reducers/adminReducer";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminAuth,refreshToken } from "../../const/localStorage";


export default function AdminLogin() {
  const [error, setError] = useState("");
  const [nameOrEmail, setNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const adminData = useSelector((state)=> state?.admin?.adminData)

  useEffect(()=>{
    if(adminData){
      console.log(adminData);
      navigate('/admin/dashboard')
    }
  },[adminData])
  const setCredentials = () => {
    if (!nameOrEmail) {
      setError("Please enter a username or email");
      return false;
    }
    if (!password) {
      setError("Please enter a password");
      return false;
    }
    const adminData = {
      password: password,
    };
    if (nameOrEmail.includes("@")) {
      adminData.email = nameOrEmail;
    } else {
      adminData.username = nameOrEmail;
    }
    return adminData;
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault()
    const adminData = setCredentials();
    if (!adminData) return;

    try {
      const response = await adminLogin(adminData);
      if (response.status === 200) {
        localStorage.setItem(adminAuth, response.data.tokens.accessToken);
        localStorage.setItem(refreshToken, response.data.tokens.refreshToken); 
        dispatch(setAdmin({ adminData: response.data }));
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error?.response?.message || error?.message);
    }
    
  };

  return (
    <Container component="main" maxWidth="lg" className="login-container">
      <CssBaseline />
      <Grid container spacing={2}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          className="login-image"
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
          className="login-form-container"
        >
          <Box className="login-box">
            <Typography component="h1" variant="h5" className="login-title">
              Sign in
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => setNameOrEmail(e.target.value)}
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="login-button"
                onClick={handleSubmit}
              >
                Sign In
              </Button>
              <Grid container className="login-link-container">
                <Grid item xs>
                  <Link href="/forgotpassword/patient?isAdmin=true" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/admin/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
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
