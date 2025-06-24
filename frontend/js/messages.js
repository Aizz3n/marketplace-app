function showMessage(message, type = "success") {
  const container = document.getElementById("message-container");
  container.innerHTML = `<div class="message ${type}">${message}</div>`;

  setTimeout(() => {
    container.innerHTML = "";
  }, 3000);
}
