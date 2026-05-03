export const validateLogin = (formData, t) => {
  const errors = {};

  const email = formData.email?.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!email) {
    errors.email = t("validation.emailRequired");
  } else if (!emailRegex.test(email)) {
    errors.email = t("validation.invalidEmail");
  }

  const password = formData.password?.trim();
  const passwordMinLength = 6;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;

  if (!password) {
    errors.password = t("validation.passwordRequired");
  } else if (password.length < passwordMinLength) {
    errors.password = t("validation.passwordMin", {
      length: passwordMinLength,
    });
  } else if (!passwordRegex.test(password)) {
    errors.password = t("validation.passwordFormat");
  }

  return errors;
};

export const validateSignup = (values, t) => {
  const errors = {};

  const name = values.name?.trim();
  if (!name) {
    errors.name = t("validation.usernameRequired");
  }

  const email = values.email?.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!email) {
    errors.email = t("validation.emailRequired");
  } else if (!emailRegex.test(email)) {
    errors.email = t("validation.invalidEmail");
  }

  const password = values.password?.trim();
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;

  if (!password) {
    errors.password = t("validation.passwordRequired");
  } else if (password.length < 6) {
    errors.password = t("validation.passwordMin", { length: 6 });
  } else if (!passwordRegex.test(password)) {
    errors.password = t("validation.passwordFormat");
  }

  // const confirm = values.confirmPassword?.trim();
  // if (confirm !== password) {
  //   errors.confirmPassword = t("validation.passwordMatch");
  // }

  return errors;
};

export const validateOTP = (otp, t) => {
  const errors = {};

  if (!otp || otp.length !== 6) {
    errors.otp = t("validation.otpLength");
  }

  return errors;
};

export const validateForgetPassword = (email, t) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = t("validation.emailRequired");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = t("validation.invalidEmail");
  }

  return errors;
};

export const validateResetPassword = (values, t) => {
  const errors = {};

  const password = values.password?.trim();
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;

  if (!password) {
    errors.password = t("validation.passwordRequired");
  } else if (password.length < 6) {
    errors.password = t("validation.passwordMin", { length: 6 });
  } else if (!passwordRegex.test(password)) {
    errors.password = t("validation.passwordFormat");
  }

  const confirm = values.confirmPassword?.trim();
  if (confirm !== password) {
    errors.confirmPassword = t("validation.passwordMatch");
  }

  return errors;
};