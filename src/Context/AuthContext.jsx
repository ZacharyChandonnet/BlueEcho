
import React, {useContext, useState, useEffect} from "react";

import {auth, db} from '../Config/firebase';

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
// Va permettre de se connecter avec Google!

// authContext est un objet qui contient les fonctions et les valeurs que nous voulons partager avec les composantes
const authContext = React.createContext({
  login: async () => {}, // Pas besoin de passer email et password car on n'utilise pas signInWithEmailAndPassword
  register: async () => {},
  logout: () => {},
  user: null,
  _v: 0,
});

// useAuth donne accès à l'objet authContext fait plus haut :)
const useAuth = () => {
    const context = useContext(authContext);
    if(context._v === 0){
        throw new Error("useAuth doit être utilisé dans un AuthProvider");
    }
    
    return context; 
};

// AuthProvider va contenir les fonctions et les valeurs que nous voulons partager avec les composantes. On lui passe useAuth.
const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setUser(user);
        setLoading(false);
      });
  
      return unsubscribe;
    }, []);

    // Le fameux login avec Google
    const login = async () => {
      try {
        const provider = new GoogleAuthProvider(); // On crée une instance de GoogleAuthProvider (et on attend qu'elle soit créée)
        const creds = await signInWithPopup(auth, provider);
        setUser(creds.user);
        return { success: true, message: "Connexion réussie" };
      } catch (error) {
        return { success: false, message: "Échec de la connexion. Veuillez réessayer." };
      }
    };
      
    // Le register. Merci Google de ne plus nous laisser gérer les emails et les mots de passe!
    const register = async () => {
      try {
        const provider = new GoogleAuthProvider();
        const creds = await signInWithPopup(auth, provider);
        setUser(creds.user);
        return { success: true, message: "Inscription réussie" };
      } catch (error) {
        return { success: false, message: "Échec de l'inscription. Veuillez réessayer." };
      }
    };

    // Permet tout simplement de viser l'user, de le déconnecter mais aussi d'arrêter les musiques en cours de lecture.
    const logout = async () => {
        try {
          await signOut(auth); 
          setUser(null); 
        } catch (error) {
          console.error("Erreur de déconnexion : ", error);
        }
      };

    return (
        <authContext.Provider value={{ _v: 1, login, register, logout, user }}>
            {!loading && children}
        </authContext.Provider>
    );
};

export { AuthProvider, useAuth, authContext };