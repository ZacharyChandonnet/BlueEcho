import { useUser } from "../Context/UserContext";
import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import CreerPlaylist from "./CreerPlaylist";
import { FaPencilAlt } from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import Astronaute from "../Animations/astronaute.json";
import "./Playlist.css";

const Playlist = ({ cover }) => {
  const navigate = useNavigate();
  const { user, changerNomPlaylist, deletePlaylist, addNotification } =
    useUser();
  const [lecture, setLectures] = useState([]);
  const [nouveauNom, setNouveauNom] = useState("");
  const [playlistEnEdition, setPlaylistEnEdition] = useState(null);
  const [menuVisible, setMenuVisible] = useState({});

  useEffect(() => {
    if (user) {
      setLectures(user.playlists);
    }
  }, [user]);

  const handleChangerNomPlaylist = async (playlistId) => {
    if (nouveauNom.trim() === "") {
      return;
    }

    await changerNomPlaylist(playlistId, nouveauNom);
    setLectures((prevPlaylists) => {
      return prevPlaylists.map((playlist) => {
        if (playlist.uuid === playlistId) {
          return {
            ...playlist,
            titre: nouveauNom,
          };
        } else {
          return playlist;
        }
      });
    });

    setNouveauNom("");
    setPlaylistEnEdition(null);
  };

  const handleEditPlaylist = (playlistId, playlistTitre) => {
    setPlaylistEnEdition(playlistId);
    setNouveauNom(playlistTitre);
  };

  const handleDeletePlaylist = async (playlistId, playlistTitre) => {
    addNotification(
      "PLAYLIST",
      `Suppression de la playlist "${playlistTitre}"`
    );
    await deletePlaylist(playlistId);
    setLectures((prevPlaylists) =>
      prevPlaylists.filter((playlist) => playlist.uuid !== playlistId)
    );
    navigate("/playlist");
  };

  const handleKeyPress = (event, playlistId) => {
    if (event.key === "Enter") {
      handleChangerNomPlaylist(playlistId);
    }
  };

  const handleDotDotDotClick = (playlistId) => {
    setMenuVisible((prevMenuVisible) => ({
      ...prevMenuVisible,
      [playlistId]: !prevMenuVisible[playlistId],
    }));
  };

  const getNumberOfTracks = (playlistId) => {
    const playlist = lecture.find((playlist) => playlist.uuid === playlistId);
    return playlist && playlist.musiques ? playlist.musiques.length : 0;
  };
  
  return (
    <div className="w-11/12 m-auto">
      <div className="gradient-bg">
        <svg xmlns="https://www.w3.org/2000/svg">
          <defs>
            <filter id="goo">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="
              1 0 0 0 0  
              0 1 0 0 0  
              0 0 1 0 0  
              0 0 0 18 -8"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div className="gradients-container">
          <div className="g1"></div>
          <div className="g2"></div>
          <div className="g3"></div>
          <div className="g4"></div>
          <div className="g5"></div>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center mt-8">
        <h1 className="text-4xl font-bold text-white">Mes listes de lecture</h1>
        <CreerPlaylist />
      </div>
      <div className="mt-16">
        {lecture.length > 0 ? (
          <ul className="text-white flex flex-col items-center justify-center w-full text-2xl">
            {lecture.map((playlist) => (
              <li
                className="flex flex-row justify-between bg-black/25 rounded-xl my-1 py-4 px-4 items-center w-full"
                key={playlist.uuid}
                id={playlist.uuid}
              >
                <div className="flex justify-center items-center">
                  {cover && (
                    <img
                      src={cover}
                      alt="Album Cover"
                      className="w-14 h-14 rounded-lg mr-6"
                    />
                  )}
                  {playlistEnEdition === playlist.uuid ? (
                    <input
                      className="w-2/4 rounded-full bg-transparent border-mauve100 px-4 border-2 text-white text-xl focus:outline-none focus:border-mauve200"
                      type="text"
                      value={nouveauNom}
                      onChange={(e) => setNouveauNom(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, playlist.uuid)}
                      autoFocus
                    />
                  ) : (
                    <div>
                      <Link to={`/playlist/${playlist.uuid}`} className="text-lg lg:text-xl">
                        {playlist.titre}
                      </Link>
                      <div className="hidden sm:flex justify-center items-center text-lg font-light text-neutral-400">
                        <p className="mr-4">{user.nom}</p>
                        <div className="w-1 h-1 bg-neutral-400 rounded-full mr-5"></div>
                      </div>
                    </div>
                  )}
                </div>

                {playlistEnEdition !== playlist.uuid && (
                  <div>
                    <HiOutlineDotsHorizontal
                      onClick={() => handleDotDotDotClick(playlist.uuid)}
                    />
                    {menuVisible[playlist.uuid] && (
                      <div className="absolute bg-black/50 rounded-xl right-16 flex flex-col justify-center items-start px-8 py-4 font-light text-lg">
                        <button
                          className="flex justify-center items-center"
                          onClick={() =>
                            handleEditPlaylist(playlist.uuid, playlist.titre)
                          }
                        >
                          <FaPencilAlt className="mr-2" />
                          Renommer
                        </button>
                        <button
                          className="flex justify-center items-center"
                          onClick={() =>
                            handleDeletePlaylist(playlist.uuid, playlist.titre)
                          }
                        >
                          <IoTrashBinSharp className="mr-2" />
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {playlistEnEdition === playlist.uuid && (
                  <button
                    onClick={() => handleChangerNomPlaylist(playlist.uuid)}
                  >
                    <IoCheckmark className="text-3xl" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <p className="text-white font-bold text-2xl text-center">
              Vous n'avez encore aucune liste de lecture !
            </p>
            <Player
              autoplay
              mute
              loop
              src={Astronaute}
              className="sm:w-11/12 md:w-9/12 lg:w-7/12 xl:w-96 -z-10"
            />
          </div>
        )}
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Playlist;
