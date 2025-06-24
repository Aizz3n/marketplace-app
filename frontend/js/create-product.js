document
  .getElementById("create-product-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to login first!");
      window.location.href = "login.html";
      return;
    }

    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;

    try {
      const res = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, price, stock }),
      });

      if (!res.ok) throw new Error("Failed to create product");

      alert("Product created successfully!");
      window.location.href = "index.html";
    } catch (error) {
      alert(error.message);
    }
  });
