document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) return alert("Please login first");

  try {
    const res = await fetch("/orders/seller-orders", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    const ordersList = document.getElementById("ordersList");

    if (!data.orders.length) {
      ordersList.innerHTML = "<li>No orders found.</li>";
      return;
    }

    data.orders.forEach((order) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>Order #${order.order_id}</strong><br/>
        Buyer: ${order.buyer}<br/>
        Total: $${order.total.toFixed(2)}<br/>
        Status: ${order.status}<br/>
        Date: ${new Date(order.created_at).toLocaleString()}<br/>
        <ul>
          ${order.items
            .map(
              (item) =>
                `<li>Product #${item.product_id} - ${item.quantity} × $${item.price}</li>`
            )
            .join("")}
        </ul>
      `;
      ordersList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    alert("Failed to load orders");
  }
});
