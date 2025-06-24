const token = localStorage.getItem("token");
if (!token) {
  alert("You need to login first!");
  window.location.href = "login.html";
}

// Get product ID from URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

if (!productId) {
  alert("Product ID missing.");
  window.location.href = "my-products.html";
}

// Elements
const form = document.getElementById("edit-product-form");
const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("description");
const priceInput = document.getElementById("price");
const stockInput = document.getElementById("stock");
const cancelBtn = document.getElementById("cancel-btn");

// Fetch product data and fill form
async function fetchProduct() {
  try {
    const res = await fetch(`http://localhost:3000/products/${productId}`);
    if (!res.ok) throw new Error("Failed to fetch product");
    const data = await res.json();

    nameInput.value = data.product.name;
    descriptionInput.value = data.product.description;
    priceInput.value = data.product.price;
    stockInput.value = data.product.stock;
  } catch (err) {
    alert(err.message);
    window.location.href = "my-products.html";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedProduct = {
    name: nameInput.value.trim(),
    description: descriptionInput.value.trim(),
    price: parseFloat(priceInput.value),
    stock: parseInt(stockInput.value, 10),
  };

  try {
    const res = await fetch(`http://localhost:3000/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedProduct),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to update product");
    }

    alert("Product updated successfully!");
    window.location.href = "my-products.html";
  } catch (err) {
    alert(err.message);
  }
});

cancelBtn.addEventListener("click", () => {
  window.location.href = "my-products.html";
});

fetchProduct();
