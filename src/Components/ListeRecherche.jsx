import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import fetchJsonp from "fetch-jsonp";
import Card from "./Card";
import { useAudio } from "../Musique/AudioManager";
import { IoSearch } from "react-icons/io5";
import "./ListeRecherche.css";
import { IoIosClose } from "react-icons/io";
import { useDebounce } from "@uidotdev/usehooks";
import { FaMicrophone } from "react-icons/fa";

const ListeRecherche = ({ query, setQuery, setCurrentTrack }) => {
  const [data, setData] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const debouncedQuery = useDebounce(query, 500);
  const audioManager = useAudio();

  const handleSpeechRecognition = () => {
    const recognition = new window.webkitSpeechRecognition();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
    };

    recognition.start();
  };

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
  };

  const handleChange = (event) => {
    setQuery(event.target.value);

    if (event.target.value === "") {
      setData([]);
    }
  };

  const handleClickClear = () => {
    setQuery("");
    setData([]);
  };

  useEffect(() => {
    const fetchDeezerTracks = () => {
      if (debouncedQuery) {
        fetchJsonp(
          `https://api.deezer.com/search/track?q=${debouncedQuery}&output=jsonp`
        )
          .then((response) => response.json())
          .then((result) => {
            if (result.data) {
              setData(result.data.slice(0, 10));
            }
          })
          .catch((error) => {
            console.error("JSONP request error", error);
          });
      }
    };

    fetchDeezerTracks();
  }, [debouncedQuery]);

  useEffect(() => {
    const fetchDeezerArtists = () => {
      if (debouncedQuery) {
        fetchJsonp(
          `https://api.deezer.com/search/artist?q=${debouncedQuery}&output=jsonp`
        )
          .then((response) => response.json())
          .then((result) => {
            if (result.data) {
              setArtists(result.data.slice(0, 4));
            }
          })
          .catch((error) => {
            console.error("JSONP request error", error);
          });
      }
    };

    fetchDeezerArtists();
  }, [debouncedQuery]);

  useEffect(() => {
    const fetchDeezerAlbums = () => {
      if (debouncedQuery) {
        fetchJsonp(
          `https://api.deezer.com/search/album?q=${debouncedQuery}&output=jsonp`
        )
          .then((response) => response.json())
          .then((result) => {
            if (result.data) {
              setAlbums(result.data.slice(0, 4));
            }
          })
          .catch((error) => {
            console.error("JSONP request error", error);
          });
      }
    };

    fetchDeezerAlbums();
  }, [debouncedQuery]);

  useEffect(() => {
    const icon = document.querySelector(".icon");
    const search = document.querySelector(".search");
    const input = document.querySelector(".input-search");
    const inputComplet = document.querySelector(".input-complet");
    search.classList.add("active");
    input.classList.add("active");
    inputComplet.classList.add("active");
    icon.onclick = function () {
      search.classList.toggle("active");
      input.classList.toggle("active");
      inputComplet.classList.toggle("active");
    };
  }, []);

  useEffect(() => {
    const scrollToAlbum = () => {
      const albumId = window.location.hash.slice(1); // Récupère l'ID de l'album dans l'URL
  
      if (albumId) {
        const albumElement = document.getElementById(albumId);
  
        if (albumElement) {
          albumElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
  
    scrollToAlbum();
  }, []);

  const TruncatedTitle = ({ title, maxLength }) => {
    const truncatedTitle =
      title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;

    return (
      <h2 className="text-white lg:text-center text-sm sm:text-lg font-semibold w-10 lg:w-full sm:w-52 leading-none">
        {truncatedTitle}
      </h2>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="input-complet mx-2">
        <div className="search">
          <div className="icon">
            <IoSearch />
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="Que voulez-vous écouter ?"
              value={query}
              onChange={handleChange}
              className="input-search"
            />
          </div>

          {query ? (
            <span className="clear" onClick={handleClickClear}>
              <IoIosClose />
            </span>
          ) : (
            <span className="clear text-gray-300" onClick={handleClickClear}>
              <FaMicrophone
                className="microphone-icon text-2xl"
                onClick={handleSpeechRecognition}
              />
            </span>
          )}
        </div>
      </div>
      <h1 className="text-4xl font-bold text-white w-11/12 m-auto pt-8">Rechercher</h1>
      <div className="flex lg:flex-row flex-col lg:justify-between items-center w-11/12 m-auto">
        <div className="w-full">
          {query ? (
            data.length > 0 ? (
              <div className="pb-36">
                <p className="text-neutral-400 text-left text-lg font-bold w-full m-auto pb-5 mb-5 pt-40 border-b border-neutral-400">
                  Voici les résultats pour "{query}"
                </p>
                <div className="gridRecherche w-full">
                  <div className="block mb-10">
                    <div className="w-full">
                      {
                        query ? (
                          artists.length > 0 ? (
                            // Displaying artists if there are any
                            <div className="w-full flex flex-col items-start justify-start border-b border-neutral-400 lg:border-none pb-10">
                              <h1 className="text-neutral-400 text-left text-lg font-bold w-full m-auto mb-6">
                                Artistes
                              </h1>
                              <div className="gridArtists w-full m-auto">
                                {artists.map((artist) => (
                                  // Mapping through the list of artists
                                  <div key={artist.id} className="w-full">
                                    <Link to={`/artist/${artist.id}`}>
                                      {/* Linking to the artist's detailed page */}
                                      <div
                                        className="artist flex flex-row lg:h-[200px] lg:flex-col justify-start lg:justify-center items-center bg-blue-100 rounded-lg px-4 py-2"
                                        style={{
                                          backgroundColor: `hsl(${
                                            Math.random() * 360
                                          }, ${Math.random() * 75 + 50}%, ${
                                            Math.random() * 75 + 10
                                          }%)`,
                                        }}
                                      >
                                        <img
                                          src={artist.picture_small}
                                          alt={artist.name}
                                          className="rounded-full mr-4 lg:mr-0 lg:mb-4 "
                                        />
                                        <TruncatedTitle
                                          title={artist.name}
                                          maxLength={15}
                                        />
                                      </div>
                                    </Link>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            // Displaying a message when no artists are found
                            <h1 className="text-neutral-400 text-center text-2xl font-bold lg:pt-80 pt-24 pb-24 border-b border-neutral-400 lg:border-none">
                              Aucun artiste trouvé pour "{query}"...
                            </h1>
                          )
                        ) : null /* No query provided, render nothing */
                      }
                    </div>

                    {/* // ALBUM */}
                    <div className="w-full">
                      {
                        query ? (
                          albums.length > 0 ? (
                            // Displaying albums if there are any
                            <div className="w-full flex flex-col items-start justify-start border-b border-neutral-400 lg:border-none pb-10">
                              <h1 className="text-neutral-400 text-left text-lg font-bold w-full m-auto mb-6">
                                Albums
                              </h1>
                              <div className="gridArtists w-full m-auto">
                              {albums.map((album) => (
                                // Mapping through the list of albums
                                <div key={album.id} className="w-full">
                                <Link to={`/artist/${album.artist.id}#album-${album.id}`}>
                                    {/* Linking to the artist's detailed page */}
                                    <div
                                      className="artist flex flex-row lg:h-[200px] lg:flex-col justify-start lg:justify-center items-center bg-blue-100 rounded-lg px-4 py-2"
                                      style={{
                                        backgroundColor: `hsl(${
                                          Math.random() * 360
                                        }, ${Math.random() * 75 + 50}%, ${
                                          Math.random() * 75 + 10
                                        }%)`,
                                      }}
                                    >
                                      <img
                                        src={album.cover_small}
                                        alt={album.title}
                                        className="rounded-full mr-4 lg:mr-0 lg:mb-4 "
                                      />
                                      <TruncatedTitle
                                        title={album.title}
                                        maxLength={15}
                                      />
                                      <p className="text-sm text-center text-white hidden lg:block">Par {album.artist.name}</p>
                                    </div>
                                  </Link>
                                </div>
                              ))}
                              </div>
                            </div>
                          ) : (
                            // Displaying a message when no albums are found
                            <h1 className="text-neutral-400 text-center text-2xl font-bold lg:pt-80 pt-24 pb-24 border-b border-neutral-400 lg:border-none">
                              Aucun album trouvé pour "{query}"...
                            </h1>
                          )
                        ) : null /* No query provided, render nothing */
                      }
                    </div>
                  </div>
                  <div>
                    <div className="w-full lg:pl-12 m-auto flex flex-col items-start justify-start">
                      <h1 className="text-neutral-400 text-left text-lg font-bold">
                        Pistes
                      </h1>
                      {data.map((item) => (
                        <div key={item.id} className="w-full">
                          {/* <Link to={`/recherche/${item.id}`}> */}
                            <Card
                              id={item.id}
                              artiste={item.artist.name}
                              artisteId={item.artist.id}
                              title={item.title}
                              image={item.album.cover_big}
                              preview={item.preview}
                              audioManager={audioManager}
                              onTrackSelect={handleTrackSelect}
                              album={item.album.title}
                              albumId={item.album.id}
                            />
                          {/* </Link> */}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <h1 className="text-neutral-400 text-center text-2xl font-bold pt-96">
                Aucun résultat trouvé pour "{query}"...
              </h1>
            )
          ) : (
            <div className="bg-blue-100 mt-28">
              {/* METTRE ALBUM TRENDING ICI*/}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListeRecherche;
