document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const messageBox = document.getElementById("auth-message");
  const membersOnlySection = document.getElementById("members-only");
  const showRegisterLink = document.getElementById("show-register");
  const showLoginLink = document.getElementById("show-login");
  const logoutBtn = document.getElementById("logout-btn");

  /* === LOGIN / REGISTER toggle */

  if (showRegisterLink) {
    showRegisterLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.style.display = "none";
      registerForm.style.display = "block";
    });
  }

  if (showLoginLink) {
    showLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.style.display = "block";
      registerForm.style.display = "none";
    });
  }

  /* Error or Success Message on Login */
  function showMessage(text, type = "info") {
    if (!messageBox) return;
    messageBox.textContent = text;
    messageBox.className = `auth-message ${type}`;
  }

  const savedUserEmail = localStorage.getItem("userEmail");

  if (savedUserEmail && membersOnlySection) {
    membersOnlySection.style.display = "block";
    showMessage(`Logged in as ${savedUserEmail}`, "success");
  }

  /* === REGISTER FORM === */
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("register-email").value.trim();
      const password = document.getElementById("register-password").value;

      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          showMessage(data.error || "Registration failed", "error");
          return;
        }

        showMessage("Registration successful! You can log in now.", "success");
      } catch (err) {
        console.error(err);
        showMessage("Something went wrong. Please try again.", "error");
      }
    });
  }

  /* === LOGIN FORM === */
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;

      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          showMessage(data.error || "Login failed", "error");
          return;
        }

        localStorage.setItem("userEmail", data.user.email);

        showMessage(`Hello, ${data.user.email}`, "success");

        if (membersOnlySection) {
          membersOnlySection.style.display = "block";
        }
      } catch (err) {
        console.error(err);
        showMessage("Server error. Try again later.", "error");
      }
    });
  }

  /* Logout Button */
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("userEmail");
      if (membersOnlySection) membersOnlySection.style.display = "none";
      if (loginForm) loginForm.style.display = "block";
      if (registerForm) registerForm.style.display = "none";
      showMessage("You have been signed out.", "info");
      window.location.href = "login.html";
    });
  }
});
