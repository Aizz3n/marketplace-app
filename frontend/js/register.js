const form = document.getElementById("register-form");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  try {
    const response = await fetch("http://localhost:3000/users/register", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username, email, password, role }),
    });

    const data = await response.json();

    if (response.ok) {
      message.style.color = "green";
      message.textContent = "Registration successful! You can login now.";
      form.reset();
    } else {
      message.style.color = "red";
      message.textContent = data.error || "Registration failed";
    }
  } catch {
    message.style.color = "red";
    message.textContent = "Server error. Try again later";
  }
});
