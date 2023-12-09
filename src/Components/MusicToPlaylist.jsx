import React, { useState, useEffect } from "react";
import { useUser } from "../Context/UserContext";
import { IoIosAdd } from "react-icons/io";
import './Card.css'

const MusicToPlaylist = ({ musiqueId, musiqueTitle }) => {
  const { user, ajouterMusiqueSelonPlaylist, ajouterPlaylist, addNotification } = useUser();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showPlaylists, setShowPlaylists] = useState(false);

  useEffect(() => {
    if (user && user.playlists) {
      setPlaylists(user.playlists);
    }
  }, [user]);

  const handlePlaylistChange = async (playlistId) => {
    setSelectedPlaylist(playlistId);

    if (playlistId && musiqueId) {
      try {
        await ajouterMusiqueSelonPlaylist(musiqueId, playlistId);
        addNotification("MUSIQUE", "La musique " + musiqueTitle + " a été ajoutée à la playlist");
        console.log("ID de la musique ajouté avec succès à la playlist");
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'ID de la musique à la playlist", error);
        addNotification("ERREUR", "Erreur lors de l'ajout de la musique à la playlist");
      } finally {
        // Close the menu after adding to the playlist
        setShowPlaylists(false);
      }
    }
  };

  const handleCreateOrUpdatePlaylist = async () => {
    try {
      if (selectedPlaylist) {
        // Update the playlist
        await ajouterPlaylist(selectedPlaylist, inputValue);
        setPlaylists((prevPlaylists) =>
          prevPlaylists.map((playlist) => {
            if (playlist.uuid === selectedPlaylist) {
              return {
                ...playlist,
                titre: inputValue,
              };
            } else {
              return playlist;
            }
          })
        );
      } else {
        // Create a new playlist
        const newPlaylist = await ajouterPlaylist(inputValue);
        setPlaylists((prevPlaylists) => [...prevPlaylists, newPlaylist]);
        setSelectedPlaylist(newPlaylist.uuid);
      }
    } catch (error) {
      console.error("Erreur lors de la création ou mise à jour de la playlist", error);
    } finally {
      // Clear the input and close the menu
      setInputValue("");
      setShowPlaylists(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        className="flex justify-end items-end w-full text-white text-3xl cursor-pointer"
        onClick={() => setShowPlaylists(!showPlaylists)}
      >
        +
      </button>

      {showPlaylists && (
        <div
          style={{
            position: "absolute",
            top: "-100%",
            right: "30px",
            width: "220px",
            background: "#9E4BF1",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            zIndex: 1,
            padding: "10px",
          }}
        >
          <div>
            <p className="text-white font-medium">Ajouter à la liste ...</p>
            <div className="w-full bg-transparent border-b border-white text-white outline-none my-2"></div>
          </div>
          <div>
            {playlists.map((playlist) => (
              <div
                key={playlist?.uuid}
                onClick={() => handlePlaylistChange(playlist?.uuid)}
                style={{ cursor: "pointer", color: "white" }}
              >
                {playlist?.titre}
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center w-full  mt-3 rounded-full overflow-hidden">
            <input
              type="text"
              placeholder={selectedPlaylist ? "Créer une nouvelle playlist" : "Créer une nouvelle playlist"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-white h-8 text-mauve200 m-auto px-2 outline-none"
            />
            {inputValue && (
              <div className="flex justify-start items-center text-white h-8 bg-mauve300 px-4">
                <button
                  onClick={handleCreateOrUpdatePlaylist}
                  style={{ cursor: "pointer", padding: "0 auto", heigh: "100%" }}
                >
                  Créer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicToPlaylist;
