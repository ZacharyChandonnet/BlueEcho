import React, { useEffect, useState } from "react";
import PisteManager from "./PisteManager";
import { useUser } from "../Context/UserContext";
import Card from "./Card";
import { useAudio } from "../Musique/AudioManager";
import { Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { IoTrashBinSharp } from "react-icons/io5";

// Historique permet d'afficher les pistes jouées récemment.
function Historique({ setCurrentTrack }) {
  // État pour charger les pistes chargées depuis Firebase
  const [loadedTracks, setLoadedTracks] = useState([]);
  const {
    user,
    getPistesListePistes,
    supprimerPisteListePistes,
    changerOrdrePistes,
    totalMusiqueEcoutees,
  } = useUser();
  const [data, setData] = useState([]);
  const audioManager = useAudio();

  useEffect(() => {
    // Charge les pistes depuis la base de données Firebase lors du montage du composant
    if (user && user.listePistesId) {
      loadTracksFromFirebase(user.listePistesId);
    }
  }, [user]);

  const loadTracksFromFirebase = async (listePistesId) => {
    try {
      const loadedTracks = await getPistesListePistes(listePistesId);
      console.log("loadedTracks", loadedTracks);
      if (loadedTracks.length > 10) {
        // Si le nombre de pistes chargées depuis Firebase est supérieur à 10, les anciennes sont effacées
        const latestTracks = loadedTracks.slice(loadedTracks.length - 10);
        setLoadedTracks(latestTracks);
        console.log("loadedTracks", loadedTracks);
      } else {
        console.log("Il n'y a pas de pistes chargées depuis Firebase.");
        setLoadedTracks(loadedTracks || []);
      }
    } catch (error) {
      console.error("Error loading tracks:", error);
    }
  };

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
  };

  const handleDeleteTrack = async (trackId) => {
    try {
      await supprimerPisteListePistes(trackId, user.listePistesId);
      // Filtrer les pistes pour mettre à jour l'état local et retirer la piste supprimée
      const updatedTracks = loadedTracks.filter(
        (track) => track.id !== trackId
      );
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

  const [historiqueEnEdition, sethistoriqueEnEdition] = useState(false);

  const handleEditMode = () => {
    sethistoriqueEnEdition(!historiqueEnEdition);
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
        description: track.description,
        image: track.image,
        preview: track.preview,
      }));

      await changerOrdrePistes(updatedTracksWithInfo, user.listePistesId);

      // Mettre à jour l'état local avec les nouvelles pistes réorganisées
      setLoadedTracks(updatedTracks);
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'ordre des pistes dans Firebase :",
        error
      );
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="w-11/12 m-auto pb-36">
        <div className="fixed top-8 right-[5%] bg-mauve200 drop-shadow-2xl z-10 w-10 h-10 justify-center flex items-center rounded-full cursor-pointer">
          <FaPencilAlt
            className={historiqueEnEdition ? "hidden" : "block text-white text-xl"}
            onClick={handleEditMode}
          />
          <IoMdCheckmark
            className={historiqueEnEdition ? "block text-3xl text-white" : "hidden"}
            onClick={handleEditMode}
          />
        </div>
        <h1 className="text-white text-4xl font-bold py-8">Historique</h1>
        {loadedTracks.length === 0 ? (
          <p className="text-neutral-400 text-center text-xl md:text-2xl font-bold mt-24">
            Hmm.. l'historique semble vide pour le moment. Explorez dans
            recherche!
          </p>
        ) : (
          loadedTracks.map((track, index) => (
            console.log(track),
            <div
              key={`${track.id}-${index}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index, loadedTracks.length)}
              className="flex justify-between items-center"
            >
              <Card
                id={track.id}
                artiste={track.artiste || track.artist.name}
                artisteId={track.artisteId || track.artist.id}
                title={track.title}
                image={track.image || (track.album && track.album.cover_medium)}
                preview={track.preview}
                audioManager={audioManager}
                onTrackSelect={handleTrackSelect}
                // album={track.album}
                albumId={track.albumId}
              />
              <button onClick={() => handleDeleteTrack(track.id)} className={` ${historiqueEnEdition ? 'block' : 'hidden'}`}>
              <IoTrashBinSharp className="text-xl" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Historique;
