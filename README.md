# E-Commerce Web Application

## Solution Approach
This project is an E-Commerce web application built using **React** and **Vite**. The approach focuses on creating a modern, responsive, and seamless shopping experience with a premium, accessible UI aesthetic.
- **Frontend Framework**: React 19 for a declarative, component-based UI architecture.
- **Routing**: React Router DOM handles seamless layout navigation between Home, Products, Categories, Cart, Wishlist, and Authentication pages.
- **State Management & Context**: React Context API is customized to globally manage states such as User Authentication and Theme (Light/Dark Mode).
- **Mock Backend Integration**: JSON Server provides a pseudo-REST API, mocking a backend database seamlessly using `db.json`. It coordinates tasks like creating/storing carts, maintaining users' wishlists, and authenticating login sessions.
- **Loading State & Data Fetching**: While data is being retrieved from the backend, a UI skeleton loader provides users with immediate feedback instead of a jarring "No products found" state.
- **Interactive UI Elements**: Custom React hooks handle events, while `react-hot-toast` delivers elegant user-feedback notifications. The Homepage includes an automated slideshow highlighting premium products.

## Project Structure
The code is modularized and highly readable.
```
E-Commerce/
├── src/
│   ├── components/       # Reusable UI components (ProductCard)
│   ├── context/          # React context providers (AuthContext)
│   ├── pages/            # Distinct application views (Home, Products, Login, Register, Cart, Wishlist)
│   ├── App.jsx           # App layout and route declarations
│   ├── Navbar.jsx        # Navigation, auth dropdowns, and category linking
│   ├── index.css         # Main application style definitions & color variables (including skeleton loaders)
│   └── main.jsx          # React app DOM entry point
├── db.json               # JSON Server static database
├── index.html            # Main HTML template wrapper
└── package.json          # Node modules details and custom application scripts
```

## Resource Files
- **`db.json`**: Acts as the centralized mocked database. It contains collections for `users`, `products` (updated meticulously with external image resources like plush toys, makeup, bags, etc.), `carts`, and `wishlists`.
- **`Navbar.jsx`**: A powerful central UI hub housing routing lists, responsive dropdowns, and user-profile logout logic.
- **`src/index.css`**: Defines design tokens and global layout structure including dark/light mode functionality and UI animations.
- **`src/pages/Home.jsx`**: Functions as the main landing page containing a dynamic, automatically sliding image carousel.

## Instructions to Run Your Solution
To start developing on this project locally, ensure you have **Node.js** installed.

1. **Install Dependencies**
   Navigate to your local project directory and install the necessary modules:
   ```bash
   npm install
   ```

2. **Start the Application**
   Run the following command to concurrently start the React application and the mock backend server:
   ```bash
   npm run dev
   ```

3. **Port Numbers & Access**
   Once to command starts successfully, the system will execute two servers concurrently:
   - **Frontend (Vite / React)**: App is available at **`http://localhost:5173`**
   - **Backend Backend (JSON Server)**: API is running at **`http://localhost:5000`**

## Expected Output/Outcome
Upon accessing **`http://localhost:5173`**, you will encounter:
- **A Seamless Shopping Interface**: Users can browse dynamic products via the Home landing page, filtering products by search keywords and various preset categories. Product data features high-quality item imagery right from `db.json`. 
- **Dynamic Homepage**: A hero banner with 3 sliding images changing automatically every 1 second, and a typewriter text effect for a more premium look.
- **Skeleton Loading State**: Visually pleasing skeleton loading blocks appear temporarily while the product catalog is successfully fetched instead of a sudden "No Products Found" message.
- **Responsive Interactions**: Users navigate swiftly between their Cart and Wishlist using customized navigation that opens intuitive context menus.
- **Graceful Error Logic**: Upon entering incorrect authentication inputs, error feedback fires seamlessly via toasts.
- An end-to-end user-friendly E-commerce store demonstrating excellent mock backend communication.
