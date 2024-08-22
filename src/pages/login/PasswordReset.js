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
import { useNavigate, useLocation } from "react-router-dom";
import { passwordValidate } from "../../hooks/regValidation";
import { resetpassword } from "../../services/patient/apiMethods";
import { doctorresetpassword } from "../../services/doctor/apiMethods";
import { useSelector } from "react-redux";
import "./PasswordReset.css";
import { adminresetpassword } from "../../services/admin/apiMethods";

export default function PasswordReset() {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [poorPassword, setPoorPassword] = useState(false);
  const [weakPassword, setWeakPassword] = useState(false);
  const [strongPassword, setStrongPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const patient = useSelector((state) => state.user.userData) || {};
  const doctor = useSelector((state) => state.doctor.doctorData) || {};
  const admin = useSelector((state) => state.admin.adminData) || {};
  const { email, isDoctor, isAdmin } = location.state || {};

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== password2) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    try {
      let response;
      if (isDoctor || doctor.email) {
        response = await doctorresetpassword({
          email: email || doctor.email,
          oldPassword,
          password,
        });
      } else if (isAdmin || admin.email) {
        response = await adminresetpassword({
          email: email || admin.email,
          oldPassword,
          password,
        });
      } else if (patient.email || email) {
        response = await resetpassword({
          email: email || patient.email,
          oldPassword,
          password,
        });
      } else {
        setError("Failed to reset password. Please try again.");
        return;
      }

      if (response.status === 200) {
        if (response.status === 200) {
          if (doctor && doctor.email) {
            navigate("/doctor/profile");
          } else if (patient && patient.email) {
            navigate("/patient/profile");
          } else if (admin && admin.email) {
            navigate("/admin/home");
          } else if (isAdmin) {
            navigate("/admin/login");
          } else if (isDoctor) {
            navigate("/login/doctor");
          } else {
            navigate("/login");
          }
        }
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(
        error?.response?.message ||
          "Failed to reset password. Please try again."
      );
      setSuccess("");
    }
  };

  const handlePasswordChange = (event) => {
    const { strength, error } = passwordValidate(event.target.value);
    setPasswordStrength(strength);
    setPoorPassword(strength === "Poor");
    setWeakPassword(strength === "Weak");
    setStrongPassword(strength === "Strong");
    setError(error);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={6} className="password-reset-paper">
        <Box className="password-reset-box">
          <Typography
            component="h1"
            variant="h5"
            className="password-reset-title"
          >
            Reset Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {(patient.email || doctor.email || admin.email) && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="oldpassword"
                label="Enter Old Password"
                type="password"
                id="oldpassword"
                autoComplete="new-password"
                autoFocus
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                error={!!error || poorPassword || weakPassword}
                helperText={error || passwordStrength}
              />
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Enter New Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                handlePasswordChange(e);
              }}
              error={!!error || poorPassword || weakPassword}
              helperText={error || passwordStrength}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Re-enter New Password"
              type="password"
              id="password2"
              autoComplete="new-password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
            {error && (
              <div className="text-red-600 text-sm font-extralight py-2">
                ! {error}
              </div>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
              className="password-reset-button"
            >
              Reset Password
            </Button>
            {success && (
              <FormHelperText error={false} className="password-reset-success">
                {success}
              </FormHelperText>
            )}
            {!(doctor || patient || admin) && (
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Remember your password? Sign in
                  </Link>
                </Grid>
              </Grid>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
