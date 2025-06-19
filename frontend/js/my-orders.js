const ordersContainer = document.getElementById("orders-container");
const logoutLink = document.getElementById("logout-link");

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

logoutLink.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

async function fetchOrders() {
  try {
    const res = await fetch("http://localhost:3000/orders/my-orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!data.orders.length) {
      ordersContainer.innerHTML = "<p>Você ainda não fez nenhum pedido.</p>";
      return;
    }

    data.orders.forEach((order) => {
      const div = document.createElement("div");
      div.classList.add("order");

      const itemsHtml = order.items
        .map(
          (item) =>
            `<div class="order-item">• Produto #${item.product_id} - Qtd: ${item.quantity} - R$ ${item.price}</div>`
        )
        .join("");

      div.innerHTML = `
        <h3>Pedido #${order.order_id}</h3>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Total:</strong> R$ ${order.total.toFixed(2)}</p>
        <p><strong>Data:</strong> ${new Date(
          order.created_at
        ).toLocaleString()}</p>
        <h4>Itens:</h4>
        ${itemsHtml}
      `;

      ordersContainer.appendChild(div);
    });
  } catch (err) {
    console.error("Erro ao carregar pedidos:", err);
  }
}

fetchOrders();
