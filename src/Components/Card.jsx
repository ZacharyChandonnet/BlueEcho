import React, { useEffect, useState } from "react";
import fetchJsonp from "fetch-jsonp";
import { useAudio } from "../Musique/AudioManager";
import MusicToPlaylist from "./MusicToPlaylist";
import { Link } from "react-router-dom";
import "./Card.css";
import { useUser } from "../Context/UserContext";

const Card = ({
  id,
  title,
  artiste,
  image,
  preview,
  onTrackSelect,
  artisteId,
  album,
  albumId,
}) => {
  const audioManager = useAudio();
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const {  totalMusiqueEcoutees} = useUser();

  // Permet de récupérer les détails de l'album selon son ID
  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await fetchJsonp(
          `https://api.deezer.com/artist/${artisteId}?output=jsonp`
        );
        const result = await response.json();

        if (result) {
          setArtist(result);

          const albumsResponse = await fetchJsonp(
            `https://api.deezer.com/artist/${artisteId}/albums?output=jsonp`
          );
          const albumsResult = await albumsResponse.json();

          if (albumsResult && albumsResult.data) {
            setAlbums(albumsResult.data);
          }
        } else {
          console.error("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching artist details", error);
      }
    };

    fetchArtist();
  }, [artisteId]);

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
  };

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
  };

  const handleClick = async () => {
    onTrackSelect({
      id,
      title,
      artiste,
      artisteId,
      image,
      preview,
      album,
      albumId,
    });
    totalMusiqueEcoutees(1);
  };
  

  return (
    <div className="m-auto my-6 w-full">
      <div
        onClick={handleClick}
        className="flex flex-row justify-between items-center"
      >
        <div className="gridCard w-full">
          <div className="flex flex-row justify-start items-start">
            <img
              className="w-12 xs:w-16 mr-6"
              style={{ cursor: "pointer" }}
              src={image}
              alt={title}
            />
            <div className="w-44 md:w-80 lg:w-96">
              <p className="text-white">{title}</p>
              <Link to={`/artist/${artisteId}`}>
                <h2 className="text-neutral-400 text-sm font-medium mt-1">
                  {artiste}
                </h2>
              </Link>
            </div>
          </div>
          <div className="text-neutral-400 text-sm font-medium hidden second">
            {album}
          </div>
          <div>
            <MusicToPlaylist musiqueId={id} musiqueTitle={title} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
