import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import RemoveSong from "./RemoveSong";
import Card from "./Card";
import { Reorder } from "framer-motion";
import { BiSolidPlaylist } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { FaPencilAlt } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { PiDotsNineBold } from "react-icons/pi";
import { Player } from "@lottiefiles/react-lottie-player";
import Loading from "../Animations/loading.json";
import "./Playlist.css";

const DetailsPlaylist = ({
  setCurrentTrack,
  playlistTracks,
  setPlaylistTracks,
  nom,
  cover,
}) => {
  const { playlistId } = useParams();
  const {
    getPlaylistDetails,
    removeMusiqueSelonPlaylist,
    changerOrdreMusiques,
    user,
    addNotification,
  } = useUser();
  const [playlistDetails, setPlaylistDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
  };

  const retourPlaylist = () => {
    navigate("/playlist");
  };

  const [listeEnEdition, setListeEnEdition] = useState(false);

  const handleEditMode = () => {
    setListeEnEdition(!listeEnEdition);
  };

  const handleRemoveTrack = async (musiqueId, musiqueNom) => {
    try {
      await removeMusiqueSelonPlaylist(musiqueId, playlistId);
      const updatedDetails = await getPlaylistDetails(playlistId);
      setPlaylistDetails(updatedDetails);
      addNotification(
        "MUSIQUE",
        musiqueNom + " a été supprimée de la playlist"
      );
    } catch (error) {
      console.error("Error removing track:", error);
      addNotification(
        "ERREUR",
        "Erreur lors de la suppression de la musique de la playlist"
      );
    }
  };

  console.log("les contacts du user", user && user.contacts);

  const isUserPlaylist =
    user &&
    user.playlists &&
    user.playlists.length > 0 &&
    user.playlists.some((playlist) => playlist.uuid === playlistId);

  useEffect(() => {
    const loadPlaylistDetails = async () => {
      try {
        const details = await getPlaylistDetails(playlistId);
        setPlaylistDetails(details);
        setPlaylistTracks(details);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching playlist details:", error);
        setLoading(false);
      }
    };

    if (playlistId) {
      const delay = setTimeout(() => {
        loadPlaylistDetails();
      }, 300);

      return () => {
        clearTimeout(delay);
      };
    }
  }, [setPlaylistTracks, playlistId, getPlaylistDetails]);

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        const details = await getPlaylistDetails(playlistId);
        setPlaylistDetails(details);
      } catch (error) {
        console.error("Error fetching playlist details:", error);
      }
    };

    fetchPlaylistDetails();
  }, [getPlaylistDetails, playlistId]);

  return (
    <div>
      {loading && (
        <div className="absolute top-0 left-0 w-screen h-screen bg-black flex justify-center items-center">
          <Player autoplay mute loop src={Loading} className="w-32" />
        </div>
      )}
      {!loading && (
        <div>
          <div
            className="fixed w-screen h-screen top-0 z-20 right-0 bg-black "
            style={{ backgroundImage: `url(${cover})`, backgroundSize: "cover", backgroundPositionY: "center", filter: "brightness(40%)" }}
          ></div>
          <div className="absolute w-screen lg:w-[92%] top-0 right-0 flex justify-between items-center flex-col z-20  overflow-hidden">
            {playlistDetails && (
              <>
                <div className="flex flex-row justify-between items-center w-full px-16 pt-8">
                  <BiSolidPlaylist
                    className="z-30 text-white text-4xl"
                    onClick={retourPlaylist}
                    title="Retour aux listes de lecture"
                  />
                  <div className="fixed top-50 right-[8%] sm:right-[5%] lg:right-[3%] bg-mauve200 drop-shadow-2xl z-20 w-10 h-10 justify-center flex items-center rounded-full cursor-pointer">
                    <FaPencilAlt
                      className={
                        listeEnEdition ? "hidden" : "block text-white text-xl"
                      }
                      onClick={handleEditMode}
                    />
                    <IoMdCheckmark
                      className={
                        listeEnEdition ? "block text-3xl text-white" : "hidden"
                      }
                      onClick={handleEditMode}
                    />
                  </div>
                </div>
                <div className="bg-mauve300 flex flex-col justify-center items-center w-full relative bottom-0 mt-48 pt-36 lg:pt-0 pb-36 containerPlaylist ">
                  {cover && (
                    <img
                      src={cover}
                      alt="Album Cover"
                      className="w-52 h-52 rounded-xl mb-4 absolute -top-24 lg:left-10 2xl:left-14"
                    />
                  )}
                  <div className="flex flex-col justify-center items-center lg:items-start lg:absolute lg:-top-12 lg:left-72 2xl:left-80">
                    <h2 className="text-white font-bold text-5xl lg:text-7xl">
                      {user.playlists.map((playlist) =>
                        playlist.uuid === playlistId ? playlist.titre : ""
                      )}
                    </h2>
                    <div className="flex flex-row justify-center items-center w-full text-2xl font-light pt-6 pb-14">
                      {isUserPlaylist && (
                        <p className="text-white"> {user.nom} </p>
                      )}
                      <div className="h-2 w-2 bg-white rounded-full mx-8"></div>
                      <p className="text-center text-white">
                        {" "}
                        {playlistDetails.musiques.length} titres
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-center w-11/12 text-white font-light text-xl ligneIndication lg:mt-52 pb-4">
                    <div className="flex flex-row lg:mr-80">
                      <p className="mr-4 sm:mr-12">#</p>
                      <p>Titre</p>
                    </div>
                    <p className="hidden lg:flex lg:justify-start lg:w-full">
                      Album
                    </p>
                    <p>Actions</p>
                  </div>
                  {isUserPlaylist && (
                    <Reorder.Group
                      axis="y"
                      values={playlistDetails.musiques.map(
                        (musique) => musique.id
                      )}
                      onReorder={async (values) => {
                        const trackIds = values.map((id) => id);
                        await changerOrdreMusiques(playlistId, trackIds);
                        const updatedDetails = await getPlaylistDetails(
                          playlistId
                        );
                        setPlaylistDetails(updatedDetails);
                      }}
                    >
                      <div className="w-full pt-4">
                        {playlistDetails.musiques.length > 0 ? (
                          playlistDetails.musiques.map((musique, index) => (
                            <Reorder.Item
                              key={musique.id}
                              value={musique.id}
                            >
                              <div>
                                <div className="w-[90vw] lg:w-[85vw] flex justify-between items-center m-auto">
                                  <p className="text-white text-lg font-light mr-4 sm:mr-12">
                                    {index + 1}
                                  </p>
                                  <Card
                                    id={musique.id}
                                    title={musique.title}
                                    artiste={musique.artist?.name}
                                    artisteId={musique.artist?.id}
                                  image={musique.album?.cover}
                                    preview={musique.preview}
                                    onTrackSelect={() =>
                                      handleTrackSelect(musique)
                                    }
                                    album={musique.album?.title}
                                    albumId={musique.album?.id}
                                  />
                                  <PiDotsNineBold
                                    className={`text-3xl text-white ml-3 ${
                                      listeEnEdition ? "block" : "hidden"
                                    }`}
                                  />
                                  {listeEnEdition ? (
                                    <RemoveSong
                                      handleRemoveTrack={() =>
                                        handleRemoveTrack(
                                          musique.id,
                                          musique.title
                                        )
                                      }
                                      musiqueId={musique.id}
                                    />
                                  ) : null}
                                </div>
                              </div>
                            </Reorder.Item>
                          ))
                        ) : (
                          <p className="text-white font-bold text-2xl text-center mt-[140px] mb-52">
                            Aucune chanson dans cette playlist.
                          </p>
                        )}
                      </div>
                    </Reorder.Group>
                  )}
                  {!isUserPlaylist && (
                    <ul className="">
                      {playlistDetails.musiques.map((musique, index) => (
                        <li key={musique.id}>
                          <div className="">
                            <Card
                              id={musique.id}
                              title={`${index + 1}. ${musique.title}`}
                              artiste={musique.artist?.name}
                              artisteId={musique.artist?.id}
                              image={musique.album?.cover}
                              preview={musique.preview}
                              onTrackSelect={() => handleTrackSelect(musique)}
                              album={musique.album?.title}
                              albumId={musique.album?.id}
                            />
                            {isUserPlaylist && (
                              <RemoveSong
                                handleRemoveTrack={() =>
                                  handleRemoveTrack(musique.id)
                                }
                                musiqueId={musique.id}
                              />
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsPlaylist;
