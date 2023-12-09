import { IoTrashBinSharp } from "react-icons/io5";

const RemoveSong = ({ handleRemoveTrack, musiqueId, musiqueNom }) => {
  return (
    <button
      className="ml-3 p-2 h-full text-white rounded-md"
      onClick={() => handleRemoveTrack(musiqueId, musiqueNom)}
    >
      <IoTrashBinSharp className="text-xl" />
    </button>
  );
};

export default RemoveSong;
