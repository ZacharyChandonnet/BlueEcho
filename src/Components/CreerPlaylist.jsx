import { FaPlus } from "react-icons/fa";
import { useUser } from "../Context/UserContext";
import { useState } from "react";
import { IoAdd } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";

const CreerPlaylist = () => {
  const { ajouterPlaylist, addNotification } = useUser();
  const [playlistName, setPlaylistName] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(false);

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    ajouterPlaylist(playlistName);
    
    // Permet de créer une notification avec un ID de type PLAYLIST avec comme contenu "Création de la playlist ${playlistName}"
    addNotification("PLAYLIST", `Création de la playlist "${playlistName}"`);

    setPlaylistName("");
    setIsInputVisible(false);
  };

  const isFormValid = playlistName.trim() !== "";

  return (
    <div className="flex items-center justify-center z-20">
      <button onClick={() => setIsInputVisible(!isInputVisible)}>
        <IoAdd className="text-white text-4xl" />
      </button>
      {isInputVisible && (
        <div className="absolute w-screen h-screen left-0 top-0 flex justify-center items-center bg-black/75">
          <form
            onSubmit={handleCreatePlaylist}
            className="bg-bleu200 w-96 flex flex-col justify-center items-center rounded-3xl"
          >
            <div className="w-full">
              <IoIosClose
                onClick={() => setIsInputVisible(!isInputVisible)}
                className="text-white text-5xl float-right m-4"
              />
            </div>
            <div className="flex flex-col pt-0 pb-10">
              <h2 className="text-white font-medium text-2xl text-center mb-6">
                Créer votre liste
              </h2>
              <input
                type="text"
                placeholder="Nom de la liste"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="border-white w-full border-2 rounded-xl p-2 bg-transparent text-white text-xl mb-4 placeholder-white placeholder-opacity-50 focus:outline-none focus:border-bleu300"
              />
              <button
                type="submit"
                disabled={!isFormValid}
                className={`${
                  isFormValid ? "bg-bleu300 text-white cursor-pointer" : "bg-bleuDisabled cursor-not-allowed text-neutral-500"
                } py-2 px-5 rounded-xl text-2xl font-medium tracking-wide`}
              >
                Créer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreerPlaylist;
