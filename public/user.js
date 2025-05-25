const API_BASE_URL = "http://localhost:5000/api/v1/auth";

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const toggleBtn = document.getElementById("toggleFormBtn");
const formTitle = document.getElementById("formTitle");

function toggleForm() {
  const isLoginVisible = loginForm.classList.contains("active");
  if (isLoginVisible) {
    loginForm.classList.remove("active");
    signupForm.classList.add("active");
    formTitle.textContent = "Sign Up";
    toggleBtn.textContent = "Already have an account? Login";
    clearForm(loginForm);
  } else {
    signupForm.classList.remove("active");
    loginForm.classList.add("active");
    formTitle.textContent = "Login";
    toggleBtn.textContent = "Don't have an account? Sign Up";
    clearForm(signupForm);
  }
}

function clearForm(form) {
  form.reset();
}

toggleBtn.addEventListener("click", toggleForm);

// Signup submit
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = signupForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const role = document.getElementById("role").value;

  if (!name || !email || password.length < 6) {
    alert("❌ Please fill all fields correctly with a password of at least 6 characters.");
    submitBtn.disabled = false;
    return;
  }

  if (password !== confirmPassword) {
    alert("❌ Passwords do not match.");
    submitBtn.disabled = false;
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(`❌ Registration failed: ${data.message || "Unknown error"}`);
      submitBtn.disabled = false;
      return;
    }

    alert(`✅ Registered successfully!\nName: ${data.user.name}\nEmail: ${data.user.email}\nRole: ${data.user.role}`);

    toggleForm();
  } catch (error) {
    alert(`❌ Error occurred: ${error.message}`);
  }

  submitBtn.disabled = false;
});

// Login submit
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = loginForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("❌ Please fill in all login fields.");
    submitBtn.disabled = false;
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(`❌ Login failed: ${data.message || "Invalid credentials"}`);
      submitBtn.disabled = false;
      return;
    }

    localStorage.setItem("token", data.token);

    alert(`🔐 Logged in successfully! Welcome, ${data.user.name}`);

    // TODO: Redirect or update UI here

  } catch (error) {
    alert(`❌ Error occurred: ${error.message}`);
  }

  submitBtn.disabled = false;
});
