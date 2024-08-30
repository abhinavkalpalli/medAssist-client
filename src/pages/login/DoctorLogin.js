import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import GoogleIcon from "@mui/icons-material/Google"; 
import Modal from "@mui/material/Modal"; 
import "./Login.css"; 
import { signInWithPopup, getAuth, GoogleAuthProvider } from "firebase/auth";
import { app } from "../../Firebase";
import { doctorLogin, doctorpostRegister } from "../../services/doctor/apiMethods";
import { useDispatch, useSelector } from "react-redux";
import { setDoctors } from "../../utils/reducers/doctorReducer";
import { doctorAuth, refreshToken } from "../../const/localStorage";

export default function DoctorLogin() {
  const auth = getAuth(app);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const [error, setError] = useState("");
  const [nameOrEmail, setNameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const doctorData = useSelector((state) => state?.doctor?.doctorData);
  useEffect(() => {
    if (doctorData) {
      navigate("/doctor/dashboard");
    }
  }, [doctorData, navigate]);

  const setCredentials = () => {
    if (!nameOrEmail) {
      setError("Please enter a username or email");
      return false;
    }
    if (!password) {
      setError("Please enter a password");
      return false;
    }
    const userData = {
      password: password,
    };
    if (nameOrEmail.includes("@")) {
      userData.email = nameOrEmail;
    } else {
      userData.username = nameOrEmail;
    }
    return userData;
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const doctorData = setCredentials();
    if (!doctorData) return;

    try {
      const response = await doctorLogin(doctorData);
      if (response.status === 200) {
        localStorage.setItem(doctorAuth, response.data.tokens.accessToken);
        localStorage.setItem(refreshToken, response.data.tokens.refreshToken);
        dispatch(setDoctors({ doctorData: response.data, validUser: true }));
        navigate("/doctor/dashboard");
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error?.response?.message || error?.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const response = await doctorpostRegister({
        name: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        photo: resultsFromGoogle.user.photoURL,
        is_Verified: true,
      });
      if (response.status === 201) {
        localStorage.setItem(doctorAuth, response.data.tokens.accessToken);
        localStorage.setItem(refreshToken, response.data.tokens.refreshToken);
        dispatch(setDoctors({ doctorData: response.data, validUser: true }));
        navigate("/doctor/dashboard");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "An unexpected error occurred";
        setError(errorMessage)
    }
  };

  const navigateToPatientSignup = () => {
    handleCloseModal();
    navigate("/patient/signup");
  };

  const navigateToDoctorSignup = () => {
    handleCloseModal();
    navigate("/doctor/signup");
  };

  return (
    <Container component="main" maxWidth="lg" className="login-container">
      <CssBaseline />
      <Grid container component={Paper} elevation={6} square>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          className="login-image"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/48604/pexels-photo-48604.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} className="login-form-container">
          <Box className="login-box">
            <Typography component="h1" variant="h5" className="login-title">
              Doctor Sign In
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onInput={(e) => {
                  setNameOrEmail(e.target.value);
                }}
                autoFocus
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
                onInput={(e) => {
                  setPassword(e.target.value);
                }}
              />
              {error ? (
                <div className="text-red-600 text-sm font-extralight py-2">
                  ! {error}
                </div>
              ) : null}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="login-button"
              >
                Sign In
              </Button>
              <Box mt={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<GoogleIcon />} 
                  className="login-google-button"
                  style={{
                    backgroundColor: "#FF0000", 
                    color: "#ffffff",
                    textTransform: "none",
                  }}
                  onClick={handleGoogleSignIn}
                >
                  Sign in with Google
                </Button>
              </Box>
              <Grid container className="login-link-container">
                <Grid item xs>
                  <Link href="/forgotpassword/patient?isDoctor=true" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2" onClick={handleOpenModal}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="signup-modal-title"
        aria-describedby="signup-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="signup-modal-title" variant="h6" component="h2" gutterBottom>
            Choose your role
          </Typography>
          <Button variant="contained" color="primary" fullWidth onClick={navigateToPatientSignup}>
            Sign Up as a Patient
          </Button>
          <Box mt={2}>
            <Button variant="contained" color="primary" fullWidth onClick={navigateToDoctorSignup}>
              Sign Up as a Doctor
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}
