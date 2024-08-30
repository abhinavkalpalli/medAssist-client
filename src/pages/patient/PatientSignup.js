import React, { useState, useRef } from "react";
import "./PatientSignup.css";
import {
  Container,
  CssBaseline,
  Grid,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { regValidate, passwordValidate } from "../../hooks/regValidation";
import { postRegister } from "../../services/patient/apiMethods";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function PatientSignup() {
  const [errors, setErrors] = useState({
    email: "",
    name: "",
    password: "",
    password2: "",
    phone: "",
    address: "",
    pincode: "",
    state: "",
    country: "",
    gender: "",
    serverError: "",
  });
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [passwordStrength, setPasswordStrength] = useState("");
  const [poorPassword, setPoorPassword] = useState(false);
  const [weakPassword, setWeakPassword] = useState(false);
  const [strongPassword, setStrongPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);

    const formValues = {
      email: formData.get("email"),
      name: formData.get("name"),
      password: formData.get("password"),
      password2: formData.get("password2"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      pincode: formData.get("pincode"),
      state: formData.get("state"),
      country: formData.get("country"),
      gender: formData.get("gender"),
    };

    const validation = await regValidate(formValues);
    if (validation.valid) {
      try {
        const response = await postRegister(formValues);
        if (response.status === 201) {
          const { email, otp } = response.data;
          navigate("/otp-verification", { state: { email, otp } });
        } else {
          setErrors(response.message);
          toast.error(response.message);
        }
      } catch (error) {
        setErrors(error?.response?.message || error?.message);
        toast.error(error?.response?.message || error?.message);
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: formValues.email ? "" : "Please provide a valid email address.",
        name: formValues.name ? "" : "Please provide a name.",
        password:
          formValues.password && formValues.password.length >= 6
            ? ""
            : "Password should have a minimum length of 6 characters.",
        password2:
          formValues.password === formValues.password2
            ? ""
            : "Passwords do not match.",
        phone: formValues.phone ? "" : "Please provide a phone number.",
        address: formValues.address ? "" : "Please provide an address.",
        pincode: formValues.pincode ? "" : "Please provide a pincode.",
        state: formValues.state ? "" : "Please provide a state.",
        country: formValues.country ? "" : "Please provide a country.",
        gender: formValues.gender ? "" : "Please select a gender.",
        ...validation.error,
      }));
    }
  };

  const handlePasswordChange = (event) => {
    const { strength, error } = passwordValidate(event.target.value);
    setPasswordStrength(strength);
    setPoorPassword(strength === "Poor");
    setWeakPassword(strength === "Weak");
    setStrongPassword(strength === "Strong");
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: error,
    }));
  };

  return (
    <Container component="main" maxWidth="lg" className="signup-container">
      <CssBaseline />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={7} className="signup-image" />
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
              Sign up as a Patient
            </Typography>
            <Box
              component="form"
              noValidate
              sx={{ mt: 1 }}
              ref={formRef}
              onSubmit={handleSubmit}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={handlePasswordChange}
                error={!!errors.password}
                helperText={errors.password}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password2"
                label="Re-enter Password"
                type="password"
                id="password2"
                autoComplete="new-password"
                error={!!errors.password2}
                helperText={errors.password2}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="phone"
                label="Phone Number"
                type="tel"
                id="phone"
                error={!!errors.phone}
                helperText={errors.phone}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="address"
                label="Address"
                id="address"
                multiline
                rows={2}
                error={!!errors.address}
                helperText={errors.address}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="pincode"
                label="Pincode"
                id="pincode"
                autoComplete="postal-code"
                error={!!errors.pincode}
                helperText={errors.pincode}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="state"
                label="State"
                id="state"
                error={!!errors.state}
                helperText={errors.state}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="country"
                label="Country"
                id="country"
                error={!!errors.country}
                helperText={errors.country}
              />
              <Box className="gender-radio-group">
                <Typography component="legend" className="gender-title">
                  Gender
                </Typography>
                <RadioGroup
                  aria-label="gender"
                  name="gender"
                  className="gender-options"
                  row
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                    className="gender-radio"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                    className="gender-radio"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                    className="gender-radio"
                  />
                </RadioGroup>
                {errors.gender && (
                  <FormHelperText error={true}>{errors.gender}</FormHelperText>
                )}
              </Box>
              {errors.serverError && (
                <FormHelperText error={true}>
                  {errors.serverError}
                </FormHelperText>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="signup-button"
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2" className="signup-link">
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
