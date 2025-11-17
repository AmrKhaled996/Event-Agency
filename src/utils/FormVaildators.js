export const validateLogin = (formData) => {
  const errors = {};

  const email = formData.Email?.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }

  const password = formData.Password?.trim();
  const passwordMinLength = 6;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < passwordMinLength) {
    errors.password = `Password must be at least ${passwordMinLength} characters`;
  } else if (!passwordRegex.test(password)) {
    errors.password =
      "Password must contain at least one letter and one number";
  }

  return errors;
};

export const validateSignup = (values) => {
  const errors = {};

  const Name = values.Name?.trim();
  if (!Name) {
    errors.Name = "Username is required";
  }

  const email = values.Email?.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!email) {
    errors.Email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.Email = "Invalid email format";
  }

  const password = values.Password?.trim();
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;

  if (!password) {
    errors.Password = "Password is required";
  } else if (password.length < 6) {
    errors.Password = "Password must be at least 6 characters";
  } else if (!passwordRegex.test(password)) {
    errors.Password = "Password must contain letters and numbers";
  }

  // const confirm = values.ConfirmPassword?.trim();
  // if (confirm !== password) {
  //   errors.ConfirmPassword = "Passwords do not match";
  // }

  return errors;
};

export const validateOTP = ({ otp }) => {
  const errors = {};

  if (!otp || otp.length !== 6) {
    errors.otp = "OTP must be 6 characters.";
  }

  return errors;
};
