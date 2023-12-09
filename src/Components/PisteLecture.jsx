import React from "react";

const PisteLecture = ({ addToQueue, playNextTrack, playPreviousTrack }) => {
  return (
    <div className="piste-lecture">
      <button onClick={playPreviousTrack}>Reculer</button>
      <button onClick={() => addToQueue(/* Piste suivante */)}>Ajouter à la file</button>
      <button onClick={playNextTrack}>Avancer</button>
    </div>
  );
};

export default PisteLecture;
