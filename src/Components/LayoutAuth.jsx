import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import fetchJsonp from "fetch-jsonp";
import './Connexion.css'

function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/accueil";

  return (
    <div>
      <header className="z-10 relative flex justify-end">
      <nav>
          <ul>
          <Link to="/login">
            {location.pathname !== "/login" && (
              <li className={`text-xl text-white absolute top-0 right-0 w-44 h-12 m-4 rounded-full flex justify-center items-center transition-all duration-100 ease-in animation cursor-pointer ${isHomePage ? 'bg-transparent hover:bg-mauve200 hover:border-mauve200 border-white border-2' : ''}`}>
                Connexion
              </li>
            )}
            </Link>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
