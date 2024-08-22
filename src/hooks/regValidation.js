// src/utils/validation.js

// Validate Email
export const checkEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate Form Fields for Registration
export const checkEmpty = ({
  email,
  name,
  password,
  password2,
  phone,
  address,
  pincode,
  state,
  country,
  gender,
}) => {
  let flag = false;
  let setErr;

  if (!email || !checkEmail(email)) {
    setErr = "Please provide a valid email address.";
  } else if (!name || name.length < 3) {
    setErr = "The name must consist of a minimum of four characters and contain only letters, '_'.";
  } else if (!password || password.length < 6) {
    setErr = "Password should have a minimum length of 6 characters.";
  } else if (password !== password2) {
    setErr = "Passwords do not match.";
  } else if (!phone) {
    setErr = "Please provide a phone number.";
  } else if (!address) {
    setErr = "Please provide an address.";
  } else if (!pincode) {
    setErr = "Please provide a pincode.";
  } else if (!state) {
    setErr = "Please provide a state.";
  } else if (!country) {
    setErr = "Please provide a country.";
  } else if (!gender) {
    setErr = "Please select a gender.";
  } else {
    flag = true;
  }

  return { flag, setErr };
};

// Full Registration Validation
export const regValidate = async (formValues) => {
  return new Promise((resolve) => {
    try {
      const empty = checkEmpty(formValues);
      if (!empty.flag) {
        resolve({ valid: false, error: empty.setErr });
      } else {
        resolve({ valid: true });
      }
    } catch (error) {
      resolve({ valid: false, error: error.message });
    }
  });
};

// Password Strength Validation
export const passwordValidate = (passwordValue) => {
  const passwordLength = passwordValue.length;
  const hasUpperCase = /[A-Z]/.test(passwordValue);
  const hasLowerCase = /[a-z]/.test(passwordValue);
  const hasDigit = /[0-9]/.test(passwordValue);
  const hasSpecialChar = /[@#$%^&*!]/.test(passwordValue);

  if (passwordValue === "") {
    return { strength: "Empty", error: "Password is Empty" };
  } else if (passwordLength < 8) {
    return { strength: "Weak", error: "Password should have at least 8 characters" };
  } else if (!(hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar)) {
    return { strength: "Weak", error: "Password should contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@#$%^&*!)" };
  } else {
    return { strength: "Strong", error: "" };
  }
};
