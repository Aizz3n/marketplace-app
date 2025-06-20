const cartList = document.getElementById("cart-list");
const totalDiv = document.getElementById("total");
const checkoutBtn = document.getElementById("checkout-btn");
const token = localStorage.getItem("token");

if (!token) {
  alert("Please log in first");
  window.location.href = "login.html";
}

let cartItems = [];

function fetchCart() {
  fetch("http://localhost:3000/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      cartItems = data.cart;
      displayCart();
    });
}

function displayCart() {
  cartList.innerHTML = "";
  let total = 0;

  cartItems.forEach((item) => {
    total += item.quantity * item.price;

    const li = document.createElement("li");
    li.innerHTML = `
      Product #${item.product_id} - 
      <input type="number" value="${item.quantity}" min="1" id="qty-${
      item.cart_id
    }" />
      × $${item.price.toFixed(2)}
      <button onclick="updateQuantity(${item.cart_id})">Update</button>
      <button onclick="removeItem(${item.cart_id})">Remove</button>
    `;
    cartList.appendChild(li);
  });

  totalDiv.innerText = `Total: $${total.toFixed(2)}`;
}

function updateQuantity(cart_id) {
  const quantity = document.getElementById(`qty-${cart_id}`).value;
  fetch(`http://localhost:3000/cart/${cart_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity: parseInt(quantity) }),
  }).then(fetchCart);
}

function removeItem(cart_id) {
  fetch(`http://localhost:3000/cart/${cart_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(fetchCart);
}

checkoutBtn.addEventListener("click", () => {
  fetch("http://localhost:3000/orders/checkout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.ok) return res.json();
      else throw new Error("Checkout failed");
    })
    .then((data) => {
      alert("Order placed! Order ID: " + data.order_id);
      fetchCart();
    })
    .catch((err) => alert(err.message));
});

fetchCart();
