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
    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();
    const productsList = document.getElementById("products-list");
    productsList.innerHTML = "";

    data.products.forEach((product) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${product.name}</strong> - $${product.price} - Stock: ${product.stock}
        <button onclick="editProduct(${product.id})">Edit</button>
        <button onclick="deleteProduct(${product.id})">Delete</button>
      `;
      productsList.appendChild(li);
    });
  } catch (error) {
    alert(error.message);
  }
}

function editProduct(productId) {
  // Redireciona para uma página de edição, passando o ID via query string
  window.location.href = `edit-product.html?id=${productId}`;
}

async function deleteProduct(productId) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You need to login first!");
    return;
  }

  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const res = await fetch(`http://localhost:3000/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete product");

    alert("Product deleted successfully");
    fetchMyProducts();
  } catch (error) {
    alert(error.message);
  }
}

fetchMyProducts();
