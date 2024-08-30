import React, { useState, useRef, useEffect } from "react";
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
import { regValidatedoctor, passwordValidatedoctor } from "../../hooks/regValidationDoctors";
import { doctorpostRegister } from "../../services/doctor/apiMethods";
import { expertise } from "../../services/admin/apiMethods";
import toast from "react-hot-toast";

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
    } else {
      toast.error("Something went wrong");
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
      <Box className="signup-box">
        <Grid container spacing={0} justifyContent="center">
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
            <Box sx={{ p: 3 }}>
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
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password}
                  onChange={handlePasswordChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password2"
                  label="Confirm Password"
                  type="password"
                  id="password2"
                  autoComplete="current-password"
                  error={!!errors.password2}
                  helperText={errors.password2}
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
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2">
                      {"Already have an account? Sign In"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
