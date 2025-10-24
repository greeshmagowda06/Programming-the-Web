const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", (e) => {
  e.preventDefault(); 
  validateInputs();
});

function validateInputs() {
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  let isValid = true;

  if (emailValue === "") {
    showError(email, "Email cannot be empty");
    isValid = false;
  } else if (!isValidEmail(emailValue)) {
    showError(email, "Enter a valid email address");
    isValid = false;
  } else {
    clearError(email);
  }

  if (passwordValue === "") {
    showError(password, "Password cannot be empty");
    isValid = false;
  } else if (passwordValue.length < 6) {
    showError(password, "Password must be at least 6 characters");
    isValid = false;
  } else {
    clearError(password);
  }

  if (isValid) {
    alert("✅ Login Successful!");
    form.reset();
  }
}

function showError(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector(".error-msg");
  small.textContent = message;
  input.classList.add("error");
}

function clearError(input) {
  const formControl = input.parentElement;
  const small = formControl.querySelector(".error-msg");
  small.textContent = "";
  input.classList.remove("error");
}

function isValidEmail(email) {
  const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return regex.test(email);
}
