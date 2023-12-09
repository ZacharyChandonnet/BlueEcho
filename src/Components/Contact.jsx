import React, { useState, useEffect } from "react";
import RechercheContact from "./RechercheContact";
import { useUser } from "../Context/UserContext";
import ContactItem from "./ContactItems";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import Music from "../Animations/Music.json";
import { FaPencilAlt } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import Loading from "../Animations/loading.json";
import "./Contact.css";

const Contact = ({ setCurrentTrack, cover }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    rechercherUserNom,
    afficherContacts,
    retirerContact,
    user,
    currentlyPlaying,
    addNotification,
  } = useUser();
  const [searchResults, setSearchResults] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactEnEdition, setContactEnEdition] = useState(false);

  const handleEditMode = () => {
    setContactEnEdition(!contactEnEdition);
  };

  useEffect(() => {
    const initializeContacts = async () => {
      try {
        const userContacts = await afficherContacts();
        setContacts(userContacts || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setLoading(false);
      }
    };

    initializeContacts();
  }, [afficherContacts, currentlyPlaying, user]);

  const handleSearch = async () => {
    try {
      const results = await rechercherUserNom(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim().length >= 2) {
      setTimeout(() => {
        handleSearch();
      }, 200);
    } else {
      setSearchResults([]);
    }
  };

  const handleRetirerContact = async (contact) => {
    try {
      await retirerContact(contact);
      setContacts((prevContacts) =>
        prevContacts.filter((c) => c.email !== contact.email)
      );
      addNotification("CONTACT", contact.nom + " a été retiré de vos contacts");
    } catch (error) {
      console.error("Error removing contact:", error);
      addNotification("ERREUR", "Erreur lors de la suppression du contact");
    }
  };

  // const handleClickClear = () => {
  //   searchTerm("");
  //   setData([]);
  // };

  useEffect(() => {
    const icon = document.querySelector(".icon");
    const search = document.querySelector(".search");
    const input = document.querySelector(".input-search");
    const inputComplet = document.querySelector(".input-complet2");

    if (search && input && inputComplet) {
      search.classList.add("active");
      input.classList.add("active");
      inputComplet.classList.add("active");

      icon.onclick = function () {
        search.classList.toggle("active");
        input.classList.toggle("active");
        inputComplet.classList.toggle("active");
      };
    }
  });

  if (loading) {
    return (
      <div className="absolute top-0 left-0 w-screen h-screen bg-black flex justify-center items-center">
        <Player autoplay mute loop src={Loading} className="w-32" />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white pb-24">
      <div className="m-auto w-11/12">
        {/* <Player autoplay mute loop src={Music} className="w-full h-full z-0 opacity-25 fixed top-0"/> */}
        <div className="flex flex-row justify-between items-center relative">
          <h2 className="text-white text-4xl font-bold py-8">Mes contacts</h2>
          <div className="fixed top-50 right-[5%] bg-mauve200 drop-shadow-2xl z-10 w-10 h-10 justify-center flex items-center rounded-full cursor-pointer">
            <FaPencilAlt
              className={contactEnEdition ? "hidden" : "block"}
              onClick={handleEditMode}
            />
            <IoMdCheckmark
              className={contactEnEdition ? "block text-2xl" : "hidden"}
              onClick={handleEditMode}
            />
          </div>
        </div>
        <div className="input-complet2">
          <div className="search">
            <div className="icon">
              <IoSearch />
            </div>
            <div className="input">
              <input
                type="text"
                placeholder="Oh, qui cherchez vous ?"
                value={searchTerm}
                onChange={handleChange}
                className="input-search placeholder:text-lg"
              />
            </div>
          </div>
        </div>
        {searchTerm.length > 0 ? (
          <p className="text-neutral-400 text-lg font-bold">
            Voici les résultats pour {searchTerm}
          </p>
        ) : null}

        <RechercheContact searchResults={searchResults} />
        {contacts && contacts.length > 0 ? (
          <ul className="w-full z-20 pb-20">
            <p className="text-white text-3xl font-bold pb-4 mt-24">
              Vos contacts
            </p>
            {contacts.map((contact, index) => (
              <ContactItem
                cover={cover}
                key={index}
                contact={contact}
                onRetirerContact={handleRetirerContact}
                setCurrentTrack={setCurrentTrack}
                contactEnEdition={contactEnEdition}
              />
            ))}
          </ul>
        ) : (
          <p className="text-neutral-400 text-center text-2xl font-bold mt-24">
            Vous n'avez encore aucun contact!
          </p>
        )}
      </div>
    </div>
  );
};

export default Contact;
