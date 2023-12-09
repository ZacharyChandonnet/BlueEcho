import React from "react";
import { useAuth } from "../Context/AuthContext";
import { Outlet } from "react-router-dom";
import { UserProvider } from "../Context/UserContext";
import Header from "./Header";
import "./Layout.css"
import Notification from "./Notification";
import "./Notification.css";

function Layout() {
  const { logout } = useAuth();

  const handleLogoutAndStop = () => {
    stop(); // Arrête la musique
    logout(); // Déconnecte l'utilisateur
  };

  return (
    // <UserProvider>
    <div className="grid-interface">
      <div className="menu flex flex-col justify-center items-center">
        <Header />
      </div>
      <div className="content">
        {/* <button onClick={handleLogoutAndStop}>Déconnexion</button> */}
        <main>
          <Outlet />
        </main>
        <Notification />
      </div>
    </div>
    // </UserProvider>
  );
}

export default Layout;
