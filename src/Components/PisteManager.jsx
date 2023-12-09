import React, { useContext, useEffect, useState } from "react";
import { useUser } from "../Context/UserContext";

// PisteManager sert un peu d'historique des pistes jouées. Il permet également de gérer la liste de lecture. Ne pas confondre avec playlist.
const PisteManager = ({ tracks, currentTrack  }) => {
  const { user, ajouterPisteListePistes, supprimerPisteListePistes, getPistesListePistes, changerOrdrePistes, createListePistesForUser } = useUser();
  const [loadedTracks, setLoadedTracks] = useState([]);

  useEffect(() => {
    // Charge les pistes depuis la base de données Firebase lors du montage du composant
    if (user && user.listePistesId) {
      loadTracksFromFirebase(user.listePistesId);
    } 
  }, [user]);

  useEffect(() => {
    if (user && tracks.length > 0) {
      const latestTrack = tracks[tracks.length - 1];
      handleAddTrack(latestTrack);
    }
  }, [user, tracks]);

  const loadTracksFromFirebase = async (listePistesId) => {
    try {
      const loadedTracks = await getPistesListePistes(listePistesId);
      if (loadedTracks.length > 3) {
        // Si le nombre de pistes chargées depuis Firebase est supérieur à 5, conservez seulement les 5 plus récentes
        const latestTracks = loadedTracks.slice(loadedTracks.length - 3);
        setLoadedTracks(latestTracks);
      } else {
        setLoadedTracks(loadedTracks || []);
      }
    } catch (error) {
      console.error("Error loading tracks:", error);
    }
  };
  
  const handleAddTrack = async (track) => {
    try {
      const trackExists = loadedTracks.some((loadedTrack) => loadedTrack.id === track.id);
      if (!trackExists) {
        if (loadedTracks.length >= 3) {
          // Supprimer la piste la plus ancienne
          const updatedTracks = loadedTracks.slice(1);
          setLoadedTracks([...updatedTracks, track]);
          await supprimerPisteListePistes(loadedTracks[0].id, user.listePistesId);
        } else {
          setLoadedTracks(prevTracks => [...prevTracks, track]);
        }
        await ajouterPisteListePistes(track, user.listePistesId);
        loadTracksFromFirebase(user.listePistesId);
      } else {
        console.log("La piste est déjà présente dans la liste.");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la piste :", error);
    }
  };
  
  const handleDeleteTrack = async (trackId) => {
    try {
      await supprimerPisteListePistes(trackId, user.listePistesId);
      // Rafraîchir la liste des pistes après la suppression pour refléter les changements
      const updatedTracks = loadedTracks.filter(track => track.id !== trackId);
      setLoadedTracks(updatedTracks);
    } catch (error) {
      console.error("Erreur lors de la suppression de la piste :", error);
    }
  };
  

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (startIndex, endIndex) => {
    try {
      const updatedTracks = Array.from(loadedTracks);
      const [movedTrack] = updatedTracks.splice(startIndex, 1);
      updatedTracks.splice(endIndex, 0, movedTrack);
  
      // Construction de la nouvelle liste de pistes avec les informations complètes
      const updatedTracksWithInfo = updatedTracks.map((track) => ({
        id: track.id,
        title: track.title, 
      }));
  
      await changerOrdrePistes(updatedTracksWithInfo, user.listePistesId);
  
      // Mettre à jour l'état local avec les nouvelles pistes réorganisées
      setLoadedTracks(updatedTracks);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'ordre des pistes dans Firebase :", error);
    }
  };
  
};

export default PisteManager; 