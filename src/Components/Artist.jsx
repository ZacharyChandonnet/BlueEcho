import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import fetchJsonp from "fetch-jsonp";
import Card from "./Card";
import { useAudio } from "../Musique/AudioManager";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import "./Artist.css";

const Artist = ({ setCurrentTrack }) => {
  const { artistId } = useParams();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const selectedAlbumRef = useRef(null);
  const [isAlbum, setIsAlbum] = useState(false);
  const [topTracks, setTopTracks] = useState([]);
  const [similarArtists, setSimilarArtists] = useState([]);
  const audioManager = useAudio();

  // Ajoute un état pour suivre le nombre d'albums affichés
  const [displayedAlbums, setDisplayedAlbums] = useState([]);

  // Limite l'affichage initial à 5 albums
  useEffect(() => {
    if (albums.length > 0) {
      setDisplayedAlbums(albums.slice(0, 5));
    }
  }, [albums]);

  // Charge les albums supplémentaires lorsque l'utilisateur clique sur "Voir plus d'albums"
  const loadMoreAlbums = () => {
    const currentLength = displayedAlbums.length;
    const nextBatch = albums.slice(currentLength, currentLength + 5);
    setDisplayedAlbums([...displayedAlbums, ...nextBatch]);
  };

  const handleAlbumClose = () => {
    setIsAlbum(false);
  };

  console.log(isAlbum);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await fetchJsonp(
          `https://api.deezer.com/artist/${artistId}?output=jsonp`
        );
        const result = await response.json();

        if (result) {
          setArtist(result);

          // Cherche les albums..
          const albumsResponse = await fetchJsonp(
            `https://api.deezer.com/artist/${artistId}/albums?output=jsonp`
          );
          const albumsResult = await albumsResponse.json();

          if (albumsResult && albumsResult.data) {
            setAlbums(albumsResult.data);
          }

          // Cherche le top des pistes d'un artiste
          const topTracksResponse = await fetchJsonp(
            `https://api.deezer.com/artist/${artistId}/top?output=jsonp`
          );
          const topTracksResult = await topTracksResponse.json();

          if (topTracksResult && topTracksResult.data) {
            // On garde le top 3 pour ne pas faire exploser l'API
            const topThreeTracks = topTracksResult.data.slice(0, 3);
            setTopTracks(topThreeTracks);
          }

          // Prend les artistes similaire
          const relatedArtistsResponse = await fetchJsonp(
            `https://api.deezer.com/artist/${artistId}/related?output=jsonp`
          );
          const relatedArtistsResult = await relatedArtistsResponse.json();

          if (relatedArtistsResult && relatedArtistsResult.data) {
            setSimilarArtists(relatedArtistsResult.data.slice(0, 3));
          }
        } else {
          console.error("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching artist details", error);
      }
    };
    fetchArtist();
  }, [artistId]);

  useEffect(() => {
    const fetchTracks = async () => {
      if (selectedAlbum) {
        try {
          const response = await fetchJsonp(
            `https://api.deezer.com/album/${selectedAlbum.id}/tracks?output=jsonp`
          );
          const result = await response.json();

          if (result && result.data) {
            setTracks(result.data);
          }
        } catch (error) {
          console.error("Error fetching tracks", error);
        }
      }
    };

    fetchTracks();
  }, [selectedAlbum]);

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setIsAlbum(!isAlbum);
  };

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
  };

  const maxLengthSmallScreen = 12;
  const maxLengthMediumScreen = 20;
  const maxLengthLargeScreen = 30;

  const TruncatedTitle = ({ title }) => {
    const screenWidth = window.innerWidth;
    let maxLength = maxLengthSmallScreen;

    if (screenWidth >= 640 && screenWidth < 1024) {
      maxLength = maxLengthMediumScreen;
    } else if (screenWidth >= 1024 && screenWidth < 1280) {
      maxLength = maxLengthSmallScreen;
    } else if (screenWidth >= 1280) {
      maxLength = maxLengthLargeScreen;
    }

    const truncatedTitle =
      title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;

    return <p className="font-bold">{truncatedTitle}</p>;
  };

  return (
    <div
      className={`text-white ${selectedAlbum ? "lg:w-[57vw]" : "lg:w-[92vw]"} ${
        isAlbum ? "" : "lg:w-[92vw]"
      }`}
    >
      {artist && (
        <div>
          <img
            src={artist.picture_big}
            alt={artist.name}
            className="fixed top-0 w-screen h-screen object-cover object-center -z-10 brightness-[40%]"
          />
          <div
            className="flex flex-row justify-between items-center w-80 rounded-md relative top-2 sm:top-14 2xl:top-24 hover:left-0 -left-[260px] px-6 py-4 overflow-hidden transition-transform duration-300 ease-in-out"
            style={{
              backgroundImage: `url(${artist.picture_big})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className="absolute w-full h-full top-0 left-0"
              style={{ backdropFilter: "blur(50px)" }}
            ></div>
            <div className="flex flex-col justify-start items-start text-lg z-10">
              <p>
                <span className="font-bold">Nombre d'album</span>{" "}
                {artist.nb_album}
              </p>
              <p>
                <span className="font-bold">Écoutes mensuelles</span>{" "}
                {artist.nb_fan}
              </p>
            </div>
            <IoIosArrowForward className="z-10" />
          </div>
          <div className="flex justify-center sm:justify-start items-center mt-10 w-11/12 m-auto mb-8 sm:relative sm:-bottom-[120px] z-10 xl:-bottom-[160px]">
            <div className="bg-gradient-to-r from-bleuGradient via-bleuGradient2 to-roseGradient rounded-full p-1 mr-6">
              <img
                src={artist.picture_big}
                alt={artist.name}
                className="rounded-full w-24 sm:w-44 xl:w-64"
              />
            </div>
            <h1 className="text-2xl sm:text-4xl xl:text-5xl font-bold">
              {artist.name}
            </h1>
          </div>
        </div>
      )}

      {albums.length > 0 && (
        <div className="backdrop-blur-2xl mt-8 rounded-t-xl pb-44 sm:pt-20 xl:pt-44">
          <div className="w-11/12 m-auto">
            {topTracks.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-white text-2xl font-bold pt-8 pb-4 mb-10 border-b-[1px] border-bleu100 w-full">Populaires</h2>
                  <ul className="w-full">
                    {topTracks.map((track, index) => (
                      <div key={track.id} className="flex flex-row justify-between items-center">
                        <span className="mr-8">{index+1}</span>
                        <Card
                          key={track.id}
                          id={track.id}
                          title={track.title}
                          artiste={track.artist.name}
                          artisteId={track.artist.id}
                          image={
                            track.album && track.album.cover_medium
                              ? track.album.cover_medium
                              : albumDetails.cover_medium
                          }
                          preview={track.preview}
                          audioManager={audioManager}
                          onTrackSelect={handleTrackSelect}
                        />
                      </div>
                    ))}
                  </ul>
                </div>
            )}
            <div className="mb-16">
              <h2 className="text-white text-2xl font-bold pt-8 pb-4 mb-16 border-b-[1px] border-bleu100 w-full">
                Albums
              </h2>
              <ul className="cursor-pointer gridAlbumArtist flex flex-col justify-center items-center mb-10">
                {displayedAlbums.map((album) => (
                  <li
                    key={album.id}
                    id={`album-${album.id}`}
                    onClick={() => {
                      handleAlbumClick(album);
                      // Scroll vers l'élément sélectionné
                      if (selectedAlbumRef.current) {
                        selectedAlbumRef.current.scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                        });
                      }
                    }}
                    className={`bg-zinc-800 p-2 md:p-4 rounded-md flex md:flex-col md:items-start justify-start items-center w-full  ${
                      isAlbum
                        ? "lg:h-[200px] 2xl:h-[250px]"
                        : "md:h-[310px] lg:h-[270px] xl:h-[270px] 2xl:h-[350px] 3xl:h-[500px]"
                    }`}
                  >
                    <img
                      src={album.cover_medium}
                      alt={album.title}
                      className="rounded-md mr-4 md:mb-4 md:mr-0 md:w-full w-14"
                    />
                    <TruncatedTitle title={album.title} />
                  </li>
                ))}
                {albums.length > displayedAlbums.length && (
                  <button
                    className={`bg-zinc-800 font-bold p-4 md:p-4 rounded-md flex md:flex-col justify-center items-center w-full  ${
                      isAlbum
                        ? "lg:h-[200px] 2xl:text-lg 2xl:h-[250px]"
                        : "md:h-[310px] lg:h-[270px] 2xl:text-xl xl:h-[270px] 2xl:h-[350px] 3xl:h-[500px]"
                    }`}
                    onClick={loadMoreAlbums}
                  >
                    Voir plus d'albums
                  </button>
                )}
              </ul>
            </div>
            <div>
              <h2 className="text-white text-2xl font-bold pt-8 pb-4 mb-16 border-b-[1px] border-bleu100 w-full">Artistes similaires</h2>
              {similarArtists.length > 0 && (
                <div>
                  <ul className="w-full flex flex-col md:flex-row justify-center xl:justify-around md:justify-between items-center">
                    {similarArtists.map((similarArtist) => (
                      <li key={similarArtist}>
                        <Link to={`/artist/${similarArtist.id}`} className="flex justify-center items-center w-full flex-col-reverse mb-16 md:mb-0">
                          <h2 className="font-bold text-xl">{similarArtist.name}</h2>
                          <img
                            src={similarArtist.picture_medium}
                            alt={similarArtist.name}
                            className="rounded-full w-44 mb-4 xl:w-52 xl:mb-8"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedAlbum && (
        <div
          className={`bg-gradient-to-r from-bleuGradient via-bleuGradient2 to-roseGradient p-2 lg:absolute top-0 lg:bg-none ${
            isAlbum ? "block" : "hidden"
          }`}
          ref={selectedAlbumRef}
        >
          <div className="bg-black lg:fixed top-0 right-0 lg:h-full lg:w-[35vw] pb-36 lg:pb-16 w-full overflow-y-auto">
            <IoIosClose
              onClick={handleAlbumClose}
              className="text-white text-5xl float-right m-4"
            />
            <div className="w-11/12 m-auto flex flex-col justify-center items-center">
              <div className="flex flex-col justify-center sm:justify-end w-full items-center sm:flex-row-reverse sm:my-10">
                <h2 className="py-12 font-bold text-3xl">
                  {selectedAlbum.title}
                </h2>
                <img
                  src={selectedAlbum.cover_medium}
                  alt={selectedAlbum.title}
                  className="w-32 rounded-full sm:mr-8"
                />
              </div>
              <ul className="w-full">
                {tracks.map((track) => (
                  <Card
                    key={track.id}
                    id={track.id}
                    title={track.title}
                    artiste={track.artist.name}
                    artisteId={track.artist.id}
                    image={selectedAlbum.cover_medium}
                    preview={track.preview}
                    audioManager={audioManager}
                    onTrackSelect={handleTrackSelect}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Artist;
