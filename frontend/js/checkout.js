async function fetchCartItems() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa fazer login primeiro!");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Falha ao buscar itens do carrinho.");

    const data = await res.json();
    const cartItems = data.cart || [];

    const ul = document.getElementById("cart-items");
    ul.innerHTML = "";

    let total = 0;

    cartItems.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - ${item.quantity} x $${item.price.toFixed(
        2
      )}`;
      ul.appendChild(li);
      total += item.quantity * item.price;
    });

    document.getElementById("total-price").textContent = `$${total.toFixed(2)}`;
  } catch (error) {
    alert(error.message);
  }
}

async function finalizeOrder() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa fazer login primeiro!");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/orders/checkout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Falha ao finalizar o pedido.");
    }

    const data = await res.json();
    alert(`Pedido #${data.order_id} criado com sucesso!`);
    window.location.href = "my-orders.html";
  } catch (error) {
    alert(error.message);
  }
}

document
  .getElementById("finalize-btn")
  .addEventListener("click", finalizeOrder);

fetchCartItems();
