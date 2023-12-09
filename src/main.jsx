import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { useAuth, AuthProvider } from "./Context/AuthContext";
import {UserProvider} from "./Context/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
      <App />
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
);
