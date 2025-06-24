async function loadMenu() {
  const response = await fetch("partials/menu.html");
  const menuHtml = await response.text();
  document.getElementById("menu-container").innerHTML = menuHtml;

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }
}

loadMenu();
