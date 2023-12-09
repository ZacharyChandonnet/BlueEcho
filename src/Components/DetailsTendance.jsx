import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fetchJsonp from "fetch-jsonp";
import { Link } from "react-router-dom";
import Card from "./Card";
import { useAudio } from "../Musique/AudioManager";
import { Player } from "@lottiefiles/react-lottie-player";
import Loading from "../Animations/loading.json";
import { IoIosClose } from "react-icons/io";
import { useUser } from "../Context/UserContext"

const DetailsTendance = ({ setCurrentTrack }) => {
  const { trendingId } = useParams();
  const [albumDetails, setAlbumDetails] = useState(null);
  const audioManager = useAudio();
  const { openTendance, setOpenTendance } = useUser();


  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const response = await fetchJsonp(
          `https://api.deezer.com/album/${trendingId}?output=jsonp`
        );
        const result = await response.json();

        if (result) {
          setAlbumDetails(result);
        } else {
          console.error("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching album details", error);
      }
    };

    fetchAlbumDetails();
  }, [trendingId]);

  useEffect(() => {
    const fetchAlbumTracks = async () => {
      try {
        const response = await fetchJsonp(
          `https://api.deezer.com/album/${trendingId}/tracks?output=jsonp`
        );
        const result = await response.json();

        if (result && result.data) {
          setAlbumDetails((prevDetails) => ({
            ...prevDetails,
            tracks: result,
          }));
        } else {
          console.error("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching album details", error);
      }
    };

    fetchAlbumTracks();
  }, [trendingId]);

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
  };

  return (
    <div className="fixed w-full lg:w-[50vw] right-0 top-0 backdrop-brightness-[20%] lg:backdrop-brightness-100 h-full">
      {albumDetails ? (
        <div className="mx-auto fixed w-full p-16 z-20 py-10 rounded-[2em] shadow-xl flex flex-col bg-blue-600 justify-center items-start">
          <button
            onClick={() => setOpenTendance(!openTendance)}
            className="flex justify-end items-center w-full text-4xl"
          >
            <IoIosClose />
          </button>
          <h2 className="text-2xl font-semibold mb-4">{albumDetails.title}</h2>
          <div className="flex w-full justify-start items-center">
            <img
              src={albumDetails.cover_medium}
              alt={albumDetails.title}
              className="rounded-md w-32 mr-4"
            />
            <div className="bg-blue-400 rounded-xl px-4 py-2 h-full">
              <Link to={`/artist/${albumDetails.artist?.id}`}>
                <p className="text-white font-medium mb-1">
                  Artiste: <span className="font-light">{albumDetails.artist?.name || "Unknown"}</span>
                </p>
              </Link>
              <p className="text-white font-medium mb-1">Titre: <span className="font-light">{albumDetails.title}</span></p>
              <p className="text-white font-medium">
                Date de sortie: <span className="font-light">{albumDetails.release_date}</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute top-0 left-0 w-screen h-screen bg-black flex justify-center items-center">
          <Player autoplay mute loop src={Loading} className="w-32" />
        </div>
      )}

      <div className="w-full pt-24 fixed top-40 pb-8 rounded-b-[2em] h-[450px] overflow-y-scroll m-auto bg-blue-900">
        <div className="w-9/12 m-auto">
          <h3 className="text-2xl font-semibold mt-8 mb-4">Pistes</h3>
          {albumDetails && albumDetails.tracks ? (
            <div>
              {albumDetails.tracks.data.map((track) => (
                <ul key={track.id}>
                  <Card
                    id={track.id}
                    title={track.title}
                    artiste={
                      track.artist ? track.artist.name : "Artiste inconnu"
                    }
                    artisteId={track.artist ? track.artist.id : null}
                    image={
                      track.album && track.album.cover_medium
                        ? track.album.cover_medium
                        : albumDetails.cover_medium
                    }
                    preview={track.preview}
                    audioManager={audioManager}
                    onTrackSelect={handleTrackSelect}
                    album={track.album ? track.album.title : null}
                    albumId={track.album ? track.album.id : null}
                  />
                </ul>
              ))}
            </div>
          ) : (
            <div className="absolute top-0 left-0 w-screen h-screen bg-black flex justify-center items-center">
              <Player autoplay mute loop src={Loading} className="w-32" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsTendance;
