const cartContainer = document.getElementById("cart-container");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkout-btn");
const logoutBtn = document.getElementById("logout-link");

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

async function fetchCart() {
  try {
    const res = await fetch("http://localhost:3000/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    cartContainer.innerHTML = "";
    let total = 0;

    data.cart.forEach((item) => {
      total += item.price * item.quantity;

      const div = document.createElement("div");
      div.classList.add("cart-item");

      div.innerHTML = `
        <span>${item.name} (R$ ${item.price.toFixed(2)})</span>
        <input type="number" value="${item.quantity}" min="1" />
        <button>🗑️</button>
      `;

      const input = div.querySelector("input");
      input.addEventListener("change", () => {
        updateQuantity(item.cart_id, parseInt(input.value));
      });

      const removeBtn = div.querySelector("button");
      removeBtn.addEventListener("click", () => {
        removeFromCart(item.cart_id);
      });

      cartContainer.appendChild(div);
    });

    totalEl.textContent = total.toFixed(2);
  } catch (err) {
    console.error("Erro ao buscar carrinho:", err);
  }
}

async function updateQuantity(cartId, quantity) {
  try {
    const res = await fetch(`http://localhost:3000/cart/${cartId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });

    if (res.ok) {
      fetchCart();
    }
  } catch (err) {
    console.error("Erro ao atualizar quantidade:", err);
  }
}

async function removeFromCart(cartId) {
  try {
    const res = await fetch(`http://localhost:3000/cart/${cartId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      fetchCart();
    }
  } catch (err) {
    console.error("Erro ao remover item:", err);
  }
}

checkoutBtn.addEventListener("click", async () => {
  try {
    const res = await fetch("http://localhost:3000/orders/checkout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      alert("Pedido realizado com sucesso!");
      fetchCart();
    } else {
      alert(data.error || "Erro no checkout");
    }
  } catch (err) {
    alert("Erro ao finalizar pedido.");
  }
});

fetchCart();
