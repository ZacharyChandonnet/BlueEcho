import React, { useState } from "react";
import NavBar from "./NavBar";
import { IoSearch } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { GrContactInfo } from "react-icons/gr";
import { BiSolidPlaylist } from "react-icons/bi";
import { LuHistory } from "react-icons/lu";
import { IoNotifications } from "react-icons/io5";
import Notification from "./Notification";

// Une seule importation du fichier CSS
import "./Header.css";

import { GrLogout } from "react-icons/gr";
import { useAuth } from "../Context/AuthContext";
import { useAudio } from "../Musique/AudioManager";
import { useUser } from "../Context/UserContext";

const Header = () => {
  const { logout } = useAuth();
  const { isReady, stop } = useAudio();
  
  const handleLogoutAndStop = () => {
    stop(); // Arrête la musique
    logout(); // Déconnecte l'utilisateur
  };

  // const [showNotifications, setShowNotifications] = useState(false);
  // const { notifications } = useUser();

  // const toggleNotifications = () => {
  //   console.log("Toggle notifications called");
  //   setShowNotifications(!showNotifications);
  // };

  return (
    <header className="flex flex-col justify-between items-center">
      <div className="flex flex-col justify-center items-center w-full">
        <img src="/assets/Logos/ico_white_100.svg" alt="logo" className="w-16 m-auto mb-5 lg:block hidden"/>
        <NavBar
          links={[
            {
              url: "/profil",
              name: "Profil",
              icon: <MdAccountCircle />,
              title: "Profil"
            },
            {
              url: "/recherche",
              name: "Recherche",
              icon: <IoSearch />,
              title: "Recherche"
            },
            {
              url: "/playlist",
              name: "Playlist",
              icon: <BiSolidPlaylist />,
              title: "Liste de lecture"
            },
            {
              url: "/contact",
              name: "Contacts",
              icon: <GrContactInfo />,
              title: "Contacts"
            },
            {
              url: "/historique",
              name: "Historique",
              icon: <LuHistory />,
              title: "Historique"
            },
            // {
            //   url: "#",
            //   name: "Notifications",
            //   icon: <IoNotifications />,
            //   onClick: toggleNotifications,
            // },
          ]}
        />

      <div className="ligne"></div>
      </div>
      <h2 title="Déconnecter" onClick={handleLogoutAndStop} className="hidden lg:block"><GrLogout className="text-white text-3xl"/></h2>
    </header>
  );
};

export default Header;
