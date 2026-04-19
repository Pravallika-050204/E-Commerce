# E-Commerce Web Application

## 1. Solution Approach
This project is an E-Commerce web application built using **React** and **Vite**. The approach focuses on creating a modern, responsive, and seamless shopping experience with a premium, accessible UI aesthetic.
- **Frontend Framework**: React 19 for a declarative, component-based UI architecture.
- **Routing**: React Router DOM handles seamless layout navigation between Home, Products, Categories, Cart, Wishlist, and Authentication pages.
- **State Management & Context**: React Context API is customized to globally manage states such as User Authentication and Theme (Light/Dark Mode).
- **Mock Backend Integration**: JSON Server provides a pseudo-REST API, mocking a backend database seamlessly using `db.json`. It coordinates tasks like creating/storing carts, maintaining users' wishlists, and authenticating login sessions.
- **Interactive UI Elements**: Custom React hooks and native lifecycle events properly handle element drops like dropdowns, while `react-hot-toast` delivers elegant user-feedback notifications.

## 2. Project Structure
The code is thoroughly modularized, making it scalable and easy to trace:

```
E-Commerce/
├── src/
│   ├── components/       # Reusable UI components (ProductCard)
│   ├── context/          # React context providers (AuthContext, ThemeContext)
│   ├── pages/            # Distinct application views (Home, Products, Login, Register, Cart, Wishlist)
│   ├── App.jsx           # App layout and route declarations
│   ├── Navbar.jsx        # Navigation, auth dropdowns, and category linking
│   ├── index.css         # Main application style definitions & color variables
│   └── main.jsx          # React app DOM entry point
├── db.json               # JSON Server static database
├── index.html            # Main HTML template wrapper
└── package.json          # Node modules details and custom application scripts
```

## 3. Resource Files
- **`db.json`**: Acts as the centralized mocked database. It contains an expansive list of items separated into collections: `users`, `products` (updated meticulously with external image resources like stylish plushy toys), `carts`, and `wishlists`.
- **`Navbar.jsx`**: A powerful central UI hub that houses theme toggling, routing lists, responsive dropdowns, and user-profile logout logic.
- **`Login.jsx` & `Register.jsx`**: Form processing files constructed with robust data validation and automatic post-submission field clearing.

## 4. Instructions to Run Your Solution
To start developing on this project locally, ensure you have [Node.js](https://nodejs.org/) installed.

1. **Install Dependencies**
   Navigate to your local project directory and install the necessary modules:
   ```bash
   npm install
   ```

2. **Start Both Dev Servers**
   To easily run both the frontend mock APIs and React application simultaneously, use our packaged custom script:
   ```bash
   npm run dev
   ```

3. **Access Application**
   - The website interface will immediately be accessible via `http://localhost:5173`.
   - The JSON server will run parallel on port `5000`.

## 5. Expected Output/Outcome
Upon accessing the application, you will find:
- **A Seamless Shopping Interface**: Users can browse dynamic products via the Home landing page, filtering products by search keywords and various preset categories. Product data features high-quality item imagery right from `db.json`.
- **Responsive Interactions**: Users navigate swiftly between their Cart and Wishlist using customized navigation that opens intuitive context menus (such as profile avatar options).
- **Graceful Error Logic**: Upon entering incorrect authentication inputs, error feedback fires seamlessly via toasts and the specific inputs are cleaned automatically for usability flow.
- A functional end-to-end framework layout demonstrating excellent, secure mock backend communication logic natively handled within React logic.
