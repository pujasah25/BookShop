import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
// using curly brackets (destructure as its not default export)
import { AuthProvider } from "./context/auth";
import "antd/dist/reset.css";
import { SearchProvider } from "./context/search";
import { CartProvider } from "./context/cart";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <SearchProvider>
        <CartProvider>
        <App />
        </CartProvider>
      </SearchProvider>
    </AuthProvider>
  </React.StrictMode>
);
