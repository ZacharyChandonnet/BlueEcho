import React, { useState } from "react";
import fetchJsonp from "fetch-jsonp";
import { db } from "../Config/firebase";
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

const PlaylistOrder = ({ playlist }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const firebase = db(); 

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleReorder = async (startIndex, endIndex) => {
    const updatedPlaylist = [...playlist];
    const [removedTrack] = updatedPlaylist.splice(startIndex, 1);
    updatedPlaylist.splice(endIndex, 0, removedTrack);

    // Mettre à jour l'ordre dans Firebase (exemple fictif)
    // Vous devez remplacer cette partie avec votre logique Firebase réelle
    await firebase.updatePlaylistOrder(updatedPlaylist);

    // Mettre à jour l'état local de la playlist avec le nouvel ordre
    // setPlaylist(updatedPlaylist);
  };

  return (
    <div>
      <ul>
        {playlist.map((track, index) => (
          <li
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              if (hoveredIndex !== null) {
                handleReorder(hoveredIndex, index);
              }
            }}
          >
            {track.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistOrder;
