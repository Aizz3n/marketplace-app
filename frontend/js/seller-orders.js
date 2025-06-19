document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You must be logged in as a seller.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/seller/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    const ordersList = document.getElementById("orders-list");
    ordersList.innerHTML = "";

    if (!data.orders || data.orders.length === 0) {
      ordersList.innerHTML = "<p>No orders found.</p>";
      return;
    }

    data.orders.forEach((order) => {
      const orderEl = document.createElement("div");
      orderEl.classList.add("order");

      orderEl.innerHTML = `
        <h3>Order ID: ${order.order_id}</h3>
        <p><strong>Buyer:</strong> ${order.buyer_email}</p>
        <p><strong>Date:</strong> ${new Date(
          order.created_at
        ).toLocaleString()}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        <ul>
          ${order.items
            .map(
              (item) =>
                `<li>Product #${item.product_id} - ${item.quantity} × $${item.price}</li>`
            )
            .join("")}
        </ul>
      `;

      ordersList.appendChild(orderEl);
    });
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    alert("Failed to fetch orders.");
  }
});
