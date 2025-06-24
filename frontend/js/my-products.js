async function fetchMyProducts() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You need to login first!");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/products/my-products", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch your products");

    const data = await res.json();
    const productsList = document.getElementById("products-list");
    productsList.innerHTML = "";

    data.products.forEach((product) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${product.name}</strong> - $${product.price.toFixed(
        2
      )} - Stock: ${product.stock}
        <button class="edit-btn" data-id="${product.id}">Edit</button>
        <button class="delete-btn" data-id="${product.id}">Delete</button>
      `;
      productsList.appendChild(li);
    });

    // Edit product event
    productsList.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        window.location.href = `edit-product.html?id=${id}`;
      });
    });

    // Delete product event
    productsList.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this product?")) {
          const res = await fetch(`http://localhost:3000/products/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            alert("Product deleted");
            fetchMyProducts();
          } else {
            alert("Failed to delete product");
          }
        }
      });
    });
  } catch (error) {
    alert(error.message);
  }
}

document.getElementById("create-product-btn").addEventListener("click", () => {
  window.location.href = "create-product.html";
});

fetchMyProducts();
