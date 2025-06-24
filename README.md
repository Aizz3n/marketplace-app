# 👚 Marketplace App

Fullstack Marketplace developed using **Node.js, Express, SQLite, HTML, CSS, and Vanilla JavaScript.**

This project simulates a simple marketplace with features for **buyers and sellers.**

---

## 🚀 Technologies Used

- **Backend:** Node.js, Express, SQLite
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Authentication:** JWT (JSON Web Token)
- **Testing:** Jest, Supertest
- **Version Control:** Git

---

## 📚 Features

### 👤 User

- User registration and login (buyer and seller roles)
- Profile editing and account deletion

### 🛙️ Products

- Product listing with search and filters
- Full CRUD for sellers (create, read, update, delete)

### 👚 Cart

- Add products to cart
- Update product quantities
- Remove products from cart
- View cart items

### 📦 Orders

- Checkout functionality
- View buyer's order history
- View received orders for sellers

---

## 🗂️ Pages

| Page                  | Description                        |
| --------------------- | ---------------------------------- |
| `index.html`          | Home page (product list & filters) |
| `login.html`          | Login page                         |
| `register.html`       | Registration page                  |
| `cart.html`           | Shopping cart page                 |
| `checkout.html`       | Checkout confirmation              |
| `my-orders.html`      | Buyer's order history              |
| `seller-orders.html`  | Seller's received orders           |
| `create-product.html` | Product creation page              |
| `my-products.html`    | Seller's product list              |
| `edit-product.html`   | Product editing page               |

---

## ✅ How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/Aizz3n/marketplace-app.git
```

### 2. Install the Dependencies

```bash
npm install
```

### 3. Run the Server

```bash
npm run dev
```

### 4. Access in Your Browser

```
http://localhost:3000
```

---

## 🧪 Running the Tests

```bash
npx jest
```

---

## 📦 Project Structure

```
marketplace-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── server.js
│   │   └── app.js
│   └── tests/
├── frontend/
│   ├── css/
│   ├── js/
│   └── *.html
├── package.json
└── README.md
```

---

## ✨ Highlights

- Automated tests with Jest and Supertest
- Secure authentication with JWT
- Dynamic filters in the product listing
- Clear separation between frontend and backend

---

## 📌 Notes

This project was built for educational purposes to strengthen Fullstack development skills. It can be improved for production by adding:

- Image uploads
- More robust validation
- Advanced stock management
- Responsive design

---

## 👤 Author

**Raphael Alves**\
[GitHub: Aizz3n](https://github.com/Aizz3n)
