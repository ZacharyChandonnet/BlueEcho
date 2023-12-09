import React, { useEffect, useState } from "react";
import { useAudio } from "../Musique/AudioManager";
import { useAudioProgress, useAudioEnded } from "../Musique/AudioManager";
import AudioVisuel from "./AudioVisuel";
import PisteManager from "./PisteManager";
import DetailsPlaylist from "./DetailsPlaylist";
import { RiPlayFill } from "react-icons/ri";
import { IoPauseSharp } from "react-icons/io5";
import { IoMdVolumeHigh } from "react-icons/io";
import { MdSkipNext } from "react-icons/md";
import { MdSkipPrevious } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { IoAddCircleOutline } from "react-icons/io5";
import { SlArrowDown } from "react-icons/sl";
import "./LecteurAudio.css";
import { UserProvider } from "../Context/UserContext";
import { useUser } from "../Context/UserContext";
import {
  CircularInput,
  CircularTrack,
  CircularProgress,
  CircularThumb,
} from "react-circular-input";
import AudioVisualizerFull from "./AudioVisualizerFull";
import MusicToPlaylist from "./MusicToPlaylist";
import { Link } from "react-router-dom";

const LecteurAudio = ({ track, playlistTracks }) => {
  const {
    changeSource,
    isReady,
    play,
    pause,
    stop,
    isPaused,
    togglePause,
    duration,
    volume,
    changeVolume,
  } = useAudio();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [initialPlay, setInitialPlay] = useState(false);
  const [isComponentReady, setIsComponentReady] = useState(false);
  const audioProgress = useAudioProgress();
  // const [playlistTracks, setPlaylistTracks] = useState([]);
  const [moreDetails, setMoreDetails] = useState(true);
  const [value, setValue] = useState(0);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const AudioEnd = useAudioEnded();
  const [pisteTracks, setPisteTracks] = useState([]);
  // État pour gérer les extraits de la playlist
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const {
    user,
    currentlyPlaying,
    clearCurrentlyPlaying,
    isExpanded,
    setIsExpanded,
  } = useUser();
  const playNextTrack = () => {
    if (currentTrackIndex < playlistTracks.musiques.length - 1) {
      const nextTrack = playlistTracks.musiques[currentTrackIndex + 1];
      console.log("nextTrack", nextTrack);
      pause();

      setCurrentTrack(nextTrack);
      setSelectedTrack(nextTrack); // Mettre à jour l'état de la piste sélectionnée

      setTimeout(() => {
        changeSource(nextTrack.preview, false);
        play();
        setCurrentTrackIndex((prevIndex) => prevIndex + 1); // Mettre à jour l'index de la piste actuelle
        // console.log("currentTrackIndex", currentTrackIndex);
      }, 100);
    }
  };

  useEffect(() => {
    if (
      currentTrackIndex > 0 &&
      currentTrackIndex < playlistTracks.musiques.length
    ) {
      const nextTrack = playlistTracks.musiques[currentTrackIndex];
      // console.log("nextTrack", nextTrack);
      pause();

      setCurrentTrack(nextTrack);
      setSelectedTrack(nextTrack); // Mettre à jour l'état de la piste sélectionnée

      setTimeout(() => {
        changeSource(nextTrack.preview, true);
        play();
      }, 100);
    }
  }, [currentTrackIndex]);

  // Effet pour détecter la fin de la lecture de l'extrait actuel
  useAudioEnded(() => {
    console.log("Audio ended");
    console.log("currentTrack", currentTrack);
    console.log("playlistTracks", playlistTracks);
    playNextTrack(); // Jouez la piste suivante une fois que l'extrait actuel est terminé
  }, [currentTrackIndex, playlistTracks]);

  useEffect(() => {
    const loadAndPlayTrack = async () => {
      if (track && track.preview && currentTrack !== track) {
        setCurrentTrack(track);
        changeSource(track.preview, false);
        stop();
        setInitialPlay(true);

        setPisteTracks((prevTracks) => {
          if (!prevTracks.find((prevTrack) => prevTrack.id === track.id)) {
            return [...prevTracks, track];
          }
          return prevTracks;
        });

        // Mise en attente pour vérifier isReady après un certain temps (ici, 500ms)
        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log("isReady after timeout:", isReady);

        if (isReady) {
          play();
        }
      }
    };

    loadAndPlayTrack();
  }, [track, currentTrack, changeSource, stop, isReady]);

  useEffect(() => {
    if (currentTrack) {
      currentlyPlaying(currentTrack);
    } else {
      clearCurrentlyPlaying();
    }
  }, [currentTrack, currentlyPlaying]);

  const handleProgressChange = (e) => {
    const val = e.target.value;
    audioProgress.changeProgress(val);
  };

  useEffect(() => {
    if (track) {
      setSelectedTrack(track);
    }
  }, [track]);

  const toggleVolume = () => {
    setVolumeOpen(!volumeOpen);
  };

  const voirDetail = (e) => {
    e.stopPropagation();
    setMoreDetails(true);
    setIsExpanded(true);
    console.log("voirDetail" + isExpanded);
  };

  const closeDetail = () => {
    setMoreDetails(false);
    setIsExpanded(false);
    console.log("closeDetail" + isExpanded + " " + moreDetails);
  };

  useEffect(() => {
    const inputRange = document.querySelector('input[type="range"]');
    const progressBefore = document.querySelector(".progress-bar");

    if (inputRange && progressBefore) {
      const updateProgress = () => {
        const percent = (audioProgress.progress * 100).toFixed(2) + "%";
        progressBefore.style.width = percent;
      };

      inputRange.addEventListener("input", updateProgress);
      updateProgress();

      return () => {
        inputRange.removeEventListener("input", updateProgress);
      };
    }
  }, [audioProgress.progress]);

  useEffect(() => {
    const inputRange = document.querySelector('input[type="range"]');
    const progressBefore = document.querySelector(".progress-volume");

    if (inputRange && progressBefore) {
      const updateProgress = () => {
        const percent = (volume * 100).toFixed(2) + "%";
        progressBefore.style.width = percent;
      };

      inputRange.addEventListener("input", updateProgress);
      updateProgress();

      return () => {
        inputRange.removeEventListener("input", updateProgress);
      };
    }
  }, [volume]);

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isExpanded]);

  const TruncatedTitle = ({ title, maxLength }) => {
    const truncatedTitle =
      title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;

    return (
      <h1
        className={`text-white font-medium ${
          isExpanded ? "hidden" : "text-md"
        }`}
      >
        {selectedTrack ? selectedTrack.title : currentTrack.title}
      </h1>
    );
  };

  const [isScreensaverActive, setScreensaverActive] = useState(false);

  useEffect(() => {
    let inactivityTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => setScreensaverActive(true), 5000); // ajustez le délai selon vos besoins
    };

    const handleMouseMove = () => {
      setScreensaverActive(false);
      resetTimer();
    };

    // Initial setup
    resetTimer();

    // Event listeners
    if (isExpanded) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Clean up
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isExpanded]);

  return (
    <>
      {isScreensaverActive && isExpanded && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'black', zIndex: '100' }}>
          Écran de veille
          <AudioVisualizerFull />
        </div>
      )}
      <div className={`w-screen lg:w-11/12 z-50 lecteuraudio `}>
        <div className={` ${isExpanded ? "hidden" : "block"}`}>
          <AudioVisuel />
        </div>
        {currentTrack && isReady && (
          <div>
            <div
              className={`w-screen lg:w-full lecteurPrincipal ${
                isExpanded
                  ? "expanded flex flex-col justify-center items-start background-with-blur"
                  : ""
              }`}
              style={
                isExpanded ? { backgroundImage: `url(${track.image})` } : {}
              }
            >
              <SlArrowDown
                onClick={closeDetail}
                className={`text-4xl text-white relative left-10 top-10 cursor-pointer p-1 z-10 ${
                  isExpanded ? "block" : "hidden"
                }`}
              />
              {isExpanded ? null : (
                <div className="inputProgress">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={audioProgress.progress}
                    onChange={handleProgressChange}
                    className={`w-full progressBar rounded-full ${
                      isExpanded ? "circular" : ""
                    }`}
                  />
                  <div className="progress-bar"></div>
                </div>
              )}
              <div className="w-11/12 m-auto">
                <div
                  className={`flex flex-row justify-between items-center ${
                    isExpanded
                      ? "flex-col justify-center items-center relative -top-7"
                      : ""
                  }`}
                >
                  <div
                    onClick={voirDetail}
                    className={`flex flex-row justify-center items-center ${
                      isExpanded
                        ? "flex-col justify-center items-center relative"
                        : ""
                    }`}
                  >
                    {track.image && isExpanded ? (
                      <div className="flex flex-col justify-center items-center mt-20">
                        <h1
                          className={`text-white font-medium text-center ${
                            isExpanded ? "text-4xl" : "text-md"
                          }`}
                        >
                          {currentTrack.title}
                        </h1>
                        <Link to={`artist/${currentTrack.artisteId}`} onClick={(e) => { closeDetail(); e.stopPropagation(); }}>
                        <p className="text-white font-ligh text-lg">
                          {`Par ${
                            currentTrack.artiste ||
                            currentTrack.artist?.name ||
                            ""
                          }`}
                        </p>
                        </Link>
                        <div className="flex justify-center items-center relative">
                          <img
                            src={selectedTrack.image}
                            alt={selectedTrack.title}
                            className="w-72 rounded-full order-2 relative my-16"
                          />
                          <div className="absolute m-auto">
                            <CircularInput
                              value={audioProgress.progress}
                              onChange={(value) =>
                                handleProgressChange({ target: { value } })
                              }
                              className="w-80 h-80"
                            >
                              <CircularTrack
                                strokeWidth={3}
                                stroke="#fff"
                                className="circularTrack"
                              />
                              <CircularProgress
                                strokeWidth={3}
                                stroke="#48F2F2"
                              />
                              <CircularThumb r={6} fill="#fff" />
                            </CircularInput>
                            <div className="circularGradient absolute rounded-full -z-10"></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={track.image}
                        // alt={currentTrack.title}
                        className="w-12 lg:w-16 mr-6"
                      />
                    )}
                    {!track.image &&
                      currentTrack.album &&
                      currentTrack.album.cover && (
                        <div>
                          {currentTrack.image ? (
                            // Si l'image de la piste actuelle existe, l'afficher
                            <img
                              src={selectedTrack.image}
                              alt={selectedTrack.title}
                              className={`w-10 ${
                                isExpanded ? "w-72 rounded-full" : "mr-6"
                              }`}
                            />
                          ) : (
                            // Si l'image de la piste n'existe pas, vérifier si l'image de l'album est disponible
                            currentTrack.album &&
                            currentTrack.album.cover && (
                              <img
                                src={selectedTrack.album.cover}
                                alt={currentTrack.album.title}
                                className={`w-10 ${
                                  isExpanded ? "w-72 rounded-full" : "mr-6"
                                }`}
                              />
                            )
                          )}
                        </div>
                      )}
                    <TruncatedTitle title={currentTrack.title} maxLength={30} />
                  </div>
                  <div className="flex flex-row justify-center items-center">
                    <div
                      className={`flex items-center${
                        isExpanded ? " w-96 justify-around " : ""
                      }`}
                    >
                      <div className={`flex justify-center items-center flex-row-reverse ${isExpanded ? 'relative' : ''}`}>
                        <IoMdVolumeHigh
                          onClick={toggleVolume}
                          className={`ml-4 text-2xl text-white ${
                            isExpanded ? "block text-3xl" : ""
                          }`}
                        />
                        {volumeOpen && (
                          <div className={`flex justify-start items-center ${isExpanded ? 'absolute w-28 -rotate-90 right-0 -top-6' : 'relative'}`}>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.01"
                              value={volume}
                              onChange={(e) => changeVolume(e.target.value)}
                              className={`volume ${isExpanded ? "" : ""}`}
                            />
                            <div className="progress-volume"></div>
                          </div>
                        )}
                      </div>
                      {/* <IoAddCircleOutline
                        className={`text-white text-3xl ${isExpanded ? "block" : "hidden"
                          }`}
                      /> */}
                      <MdSkipPrevious
                        className={`text-white text-5xl ${
                          isExpanded ? "block" : "hidden"
                        }`}
                      />
                      <button onClick={togglePause}>
                        {isPaused ? (
                          <RiPlayFill
                            className={`text-white ${
                              isExpanded ? "text-5xl" : "text-2xl ml-6"
                            }`}
                          />
                        ) : (
                          <IoPauseSharp
                            className={`text-white ${
                              isExpanded ? "text-5xl" : "text-2xl ml-6"
                            }`}
                          />
                        )}
                      </button>
                      <MdSkipNext
                        className={`text-white text-5xl ${
                          isExpanded ? "block" : "hidden"
                        }`}
                      />
                      <div className={`relative rounded-full border-2 border-white w-7 h-7  flex justify-center items-center ${isExpanded ? "block" : "hidden"}`}>
                        <div className="absolute -top-[9px]">
                          <MusicToPlaylist
                            musiqueId={currentTrack.id}
                            musiqueTitle={currentTrack.title}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <UserProvider>
                    <PisteManager tracks={pisteTracks} />
                  </UserProvider>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default LecteurAudio;
