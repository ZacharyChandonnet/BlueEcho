import React from "react";
import { signInWithPopup } from "firebase/auth"; // Va gérer le popup de connexion avec Google
import { useAuth } from "../Context/AuthContext"; // Permet d'utiliser nos fonctions de connexion
import { useNavigate } from "react-router-dom"; // Permet de rediriger l'utilisateur après la connexion
import { FcGoogle } from "react-icons/fc";

import "./Connexion.css";

function Connexion() {
  const { login } = useAuth(); // On récupère la fonction de connexion
  const navigate = useNavigate();

  // La fonction de connexion avec Google.
  const signInWithGoogle = async () => {
    try {
      const result = await login();
      if (result.success) {
        // Si la connexion est réussie, on redirige l'utilisateur vers la page d'accueil.
        navigate("/");
      } else {
        // Gère les erreurs potentielles pour nous, les gentils développeurs.
        throw new Error(`Erreur de connexion avec Google : ${result.message}`);
      }
    } catch (error) {
      console.error(`Erreur de connexion avec Google : ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col justify-around items-center max-h-screen min-h-screen bg-cover bg-no-repeat px-16 py-32 relative overflow-hidden" style={{ backgroundImage: 'url("/assets/img/diskMusicNoisy.jpg")' }} >
      <div className="absolute bg-rose100 pute h-52 md:h-64 lg:h-72 w-full top-0 rotate-45 left-52 sm:left-64 md:left-96"></div>
      <div className="absolute bg-bleu100 h-10 w-full top-0 -left-10 -rotate-12"></div>
      <div className="flex flex-col justify-center items-center h-full md:w-9/12 lg:w-7/12 xl:w-5/12 bg-black/50 xl:bg-black/75 py-14 px-10 rounded-3xl z-10">
        <img src="/assets/Logos/Full_white.svg" alt="logo" className="h-64 mb-24 lg:h-80 md:h-72 2xl:h-80" />
        {/* <h2 className="text-2xl text-center text-white font-regular 2xl:text-3xl 2xl:w-9/12">Bienvenue! Veuillez vous connecter via Google</h2> */}
        <div className="rounded-full bg-gradient-to-r from-bleuGradient via-bleuGradient2 to-roseGradient h-16 w-80 2xl:w-7/12 flex flex-row justify-center items-center p-1">
          <div className="flex flex-row justify-center items-center bg-white w-full h-full rounded-full cursor-pointer" onClick={signInWithGoogle}>
            <div className="text-3xl mr-4">
              <FcGoogle />
            </div>
            <button className="md:text-xl text-lg font-medium" >
              Connexion avec Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Connexion;
