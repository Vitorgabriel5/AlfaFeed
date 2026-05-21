export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function isValidUsername(username) {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
}

export function isValidPassword(password) {
  return password.length >= 6;
}

export function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}