export async function login(formData) {
  return axios.post("http://localhost:3000/login", formData)
}

export async function signup(formData) {
  return axios.post("http://localhost:3000/register", formData);
}
export async function verify(otp) {
  return axios.post("http://localhost:3000/verify-otp" , otp);
}
export async function refreashToken() {
  return axios.post("http://localhost:3000/refresh-token", {});
}
export async function frogetPassword(email) {
  return axios.post("http://localhost:3000/forgot-password", email);
}
export async function logout() {
  return axios.post("http://localhost:3000/logout", {});
}
