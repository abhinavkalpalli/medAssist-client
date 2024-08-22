import React, { useState, useRef } from "react";
import { useEffect } from "react";
import "./css/DoctorSignup.css";
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import {
  regValidatedoctor,
  passwordValidatedoctor,
} from "../../hooks/regValidationDoctors";
import { doctorpostRegister } from "../../services/doctor/apiMethods";
import { expertise } from "../../services/admin/apiMethods";

export default function DoctorSignup() {
  const [errors, setErrors] = useState({
    email: "",
    name: "",
    address: "",
    password: "",
    password2: "",
    state: "",
    country: "",
    pincode: "",
    expertise: "",
    education: "",
    dateOfBirth: "",
    languageKnown: "",
    phone: "",
    gender: "",
    currentWorkingHospital: "",
    workingDays: "",
    serverError: "",
  });

  
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [poorPassword, setPoorPassword] = useState(false);
  const [weakPassword, setWeakPassword] = useState(false);
  const [strongPassword, setStrongPassword] = useState(false);
  const [specialization, setSpecialization] = useState([]);
  const [Expertise, setExpertise] = useState("");

  const fetchData = async () => {
    const response = await expertise();
    if (response.status === 200) {
      setSpecialization(response.data.data);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);

    const formValues = {
      email: formData.get("email"),
      name: formData.get("name"),
      address: formData.get("address"),
      password: formData.get("password"),
      password2: formData.get("password2"),
      state: formData.get("state"),
      country: formData.get("country"),
      pincode: formData.get("pincode"),
      expertise: Expertise,
      dateOfBirth: formData.get("dateOfBirth"),
      phone: formData.get("phone"),
      gender: formData.get("gender"),
      currentWorkingHospital: formData.get("currentWorkingHospital"),
    };

    const validation = await regValidatedoctor(formValues);
    if (validation.valid) {
      try {
        const response = await doctorpostRegister(formValues);
        if (response.status === 201) {
          const { email, otp } = response.data;
          const isDoctor = true;
          navigate("/otp-verification", { state: { email, otp, isDoctor } });
        } else {
          setErrors({
            ...errors,
            serverError: "Registration failed. Please try again later.",
          });
        }
      } catch (error) {
        console.error("Error during registration:", error);
        setErrors({
          ...errors,
          serverError: "An unexpected error occurred. Please try again later.",
        });
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
    const { strength, error } = passwordValidatedoctor(event.target.value);
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
      <Grid container spacing={0}>
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
              Sign up as a Doctor
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
              <FormControl fullWidth margin="normal">
                <InputLabel id="expertise-label">Expertise</InputLabel>
                <Select
                  labelId="expertise-label"
                  id="expertise"
                  name="expertise"
                  value={Expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                  error={!!errors.expertise}
                >
                  {specialization.map((spec) => (
                    <MenuItem key={spec._id} value={spec._id}>
                      {spec.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error>{errors.expertise}</FormHelperText>

                <FormHelperText error>{errors.expertise}</FormHelperText>
              </FormControl>
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="dateOfBirth"
                label="Date of Birth"
                id="dateOfBirth"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="phone"
                label="Phone"
                id="phone"
                autoComplete="tel"
                error={!!errors.phone}
                helperText={errors.phone}
              />
              <Typography className="gender-title">Gender</Typography>
              <RadioGroup
                aria-label="gender"
                name="gender"
                className="gender-options"
                row
              >
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label="Female"
                  className="gender-radio"
                />
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="Male"
                  className="gender-radio"
                />
                <FormControlLabel
                  value="Other"
                  control={<Radio />}
                  label="Other"
                  className="gender-radio"
                />
              </RadioGroup>
              <FormHelperText error>{errors.gender}</FormHelperText>
              <TextField
                margin="normal"
                required
                fullWidth
                name="currentWorkingHospital"
                label="Current Working Hospital"
                id="currentWorkingHospital"
                error={!!errors.currentWorkingHospital}
                helperText={errors.currentWorkingHospital}
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
                label="Re-Enter password"
                type="password"
                id="password2"
                autoComplete="new-password"
                error={!!errors.password2}
                helperText={errors.password2}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="signup-button"
              >
                Sign Up
              </Button>
              <Link href="#" variant="body2">
                {"Already have an account? Sign in"}
              </Link>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
