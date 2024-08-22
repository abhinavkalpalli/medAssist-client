
export const checkEmaildoctor = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Validate Form Fields for Registration
  export const checkEmptydoctor = ({
    email,
    name,
    phone,
    address,
    pincode,
    state,
    country,
    gender,
    expertise,
    dateOfBirth,
    currentWorkingHospital,
  }) => {
    let flag = false;
    let setErr;
  
    if (!email || !checkEmaildoctor(email)) {
      setErr = "Please provide a valid email address.";
    } else if (!name || name.length < 3) {
      setErr = "The name must consist of a minimum of three characters.";
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
    } else if (!expertise) {
      setErr = "Please provide your expertise.";
    } else if (!dateOfBirth) {
      setErr = "Please provide your date of birth.";
    } else if (!currentWorkingHospital) {
      setErr = "Please provide the current working hospital.";
    } else {
      flag = true;
    }
  
    return { flag, setErr };
  };
  
  // Full Registration Validation
  export const regValidatedoctor = async (formValues) => {
    return new Promise((resolve) => {
      try {
        const empty = checkEmptydoctor(formValues);
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
  export const passwordValidatedoctor = (passwordValue) => {
    const passwordLength = passwordValue.length;
    const hasUpperCase = /[A-Z]/.test(passwordValue);
    const hasLowerCase = /[a-z]/.test(passwordValue);
    const hasDigit = /[0-9]/.test(passwordValue);
    const hasSpecialChar = /[@#$%^&*!]/.test(passwordValue);
  
    if (passwordValue === "") {
      return { strength: "Empty", error: "Password is empty" };
    } else if (passwordLength < 8) {
      return { strength: "Weak", error: "Password should have at least 8 characters" };
    } else if (!(hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar)) {
      return { strength: "Weak", error: "Password should contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@#$%^&*!)" };
    } else {
      return { strength: "Strong", error: "" };
    }
  };
  