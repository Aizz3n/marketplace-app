async function fetchSellerOrders() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You need to login first!");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/orders/seller-orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch orders");

    const data = await res.json();
    const ordersList = document.getElementById("orders-list");
    ordersList.innerHTML = "";

    data.orders.forEach((order) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>Order #${order.order_id}</strong><br>
        Status: ${order.status}<br>
        Total: $${order.total}<br>
        Items:
        <ul>
          ${order.items
            .map(
              (item) =>
                `<li>Product #${item.product_id} - Quantity: ${item.quantity} - Price: $${item.price}</li>`
            )
            .join("")}
        </ul>
      `;
      ordersList.appendChild(li);
    });
  } catch (error) {
    alert(error.message);
  }
}

fetchSellerOrders();
