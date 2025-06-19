const productsContainer = document.getElementById("products-container");
const authLink = document.getElementById("auth-link");
const cartLink = document.getElementById("cart-link");
const logoutLink = document.getElementById("logout-link");

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (token) {
  authLink.classList.add("hidden");
  logoutLink.classList.remove("hidden");

  if (role === "buyer") {
    cartLink.classList.remove("hidden");
  }

  logoutLink.addEventListener("click", () => {
    localStorage.clear();
    window.location.reload();
  });
}

async function fetchProducts() {
  try {
    const res = await fetch("http://localhost:3000/products");
    const data = await res.json();

    if (Array.isArray(data.products)) {
      data.products.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
                <h3>${product.name}</h3>
                <p><strong>Preço:</strong> R$ ${product.price.toFixed(2)}</p>
                <p>${product.description || ""}</p>
            `;

        if (token && role === "buyer") {
          const btn = document.createElement("button");
          btn.textContent = "Adicionar ao carrinho";
          btn.onclick = () => addToCart(product.id);
          card.appendChild(btn);
        }

        productsContainer.appendChild(card);
      });
    }
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
  }
}

async function addToCart(productId) {
  try {
    const res = await fetch("http://localhost:3000/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application;json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Produto adicionado ao carrinho!");
    } else {
      alert(data.error || "Erro ao adicionar ao carrinho");
    }
  } catch (error) {
    alert("Erro de rede");
  }
}

fetchProducts();
