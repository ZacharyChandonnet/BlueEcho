import { Link } from "react-router-dom";
import Card from "./Card";
import { useAudio } from "../Musique/AudioManager";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import Speaker from "../Animations/Speaker.json";
import Audio from "../Animations/audio.json";
import { IoTrashBinSharp } from "react-icons/io5";
import "./Contact.css";

const ContactItem = ({
  contact,
  onRetirerContact,
  setCurrentTrack,
  contactEnEdition,
  cover,
}) => {
  const audioManager = useAudio();

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
  };

  return (
    <li className="flex flex-col text-white w-full py-10 itemContact">
      <div className="flex flex-col">
        <div className="flex flex-row items-center justify-between">
          <div className="flex justify-center items-center">
            <img
              src={contact.photo}
              alt={contact.nom}
              className="w-10 h-10 rounded-full mr-4"
            />
            <p className="font-bold text-xl">{contact.nom}</p>
          </div>
          <button
            className={`text-white rounded-md ${
              contactEnEdition ? "block" : "hidden"
            }`}
            onClick={() => onRetirerContact(contact)}
          >
            <IoTrashBinSharp className=" text-3xl p-[4px] rounded-md" />
          </button>
        </div>
        {contact.currentlyPlaying && (
          <div className="flex flex-col justify-center items-start mt-4 bg-neutral-800 rounded-xl p-4">
            <p className="mb-2 font-light">{contact.nom} écoute...</p>
            <div className="flex flex-row justify-between items-center w-full">
              <Player
                autoplay
                mute
                loop
                src={Speaker}
                className="w-32 hidden sm:block"
              />
              <Player
                autoplay
                mute
                loop
                src={Audio}
                className="w-8 sm:hidden"
              />
              <div className="bg-mauve200/75 px-6 conteneurContactPlaying flex flex-col justify-center items-center h-20 w-full">
                <Card
                  id={contact.currentlyPlaying.id}
                  title={contact.currentlyPlaying.title}
                  artiste={contact.currentlyPlaying.artiste}
                  artisteId={contact.currentlyPlaying.artisteId}
                  preview={contact.currentlyPlaying.preview}
                  image={
                    contact.currentlyPlaying.image ||
                    (contact.currentlyPlaying.type === "track" &&
                      contact.currentlyPlaying.album &&
                      contact.currentlyPlaying.album.cover_medium) ||
                    (contact.currentlyPlaying.type === "album" &&
                      contact.currentlyPlaying.cover_medium)
                  }
                  audioManager={audioManager}
                  onTrackSelect={handleTrackSelect}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <ul className="bg-neutral-800 rounded-xl mt-4">
        {contact.playlists &&
        Array.isArray(contact.playlists) &&
        contact.playlists.length > 0 ? (
          <ul className="bg-neutral-800 rounded-xl">
            <div className="p-4">
              <p className="text-xl font-bold">
                {contact.playlists && contact.playlists.length > 1
                  ? "Listes de lectures"
                  : "Liste de lecture"}
              </p>
              {contact.playlists.map((playlist, playlistIndex) => (
                <li
                  key={playlistIndex}
                  className="w-11/12 m-auto font-light mt-2"
                >
                  <Link
                    to={`/playlist/${playlist.uuid}`}
                    className="flex flex-row-reverse justify-end items-center font-medium"
                  >
                    {playlist.titre}
                    {cover && (
                      <img
                        src={cover}
                        alt="Album Cover"
                        className="w-16 h-16 rounded-xl mr-6"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </div>
          </ul>
        ) : null}
      </ul>
    </li>
  );
};

export default ContactItem;
