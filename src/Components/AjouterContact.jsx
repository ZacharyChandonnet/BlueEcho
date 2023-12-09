import React from "react";
import { useUser } from "../Context/UserContext";
import { useState } from "react";
import { IoIosAdd } from "react-icons/io";

const AjouterContact = ({ contact }) => {
  const { ajouterContact, addNotification } = useUser();
  const [contacts, setContacts] = useState([]);

  const handleAjouterContact = async (contact) => {
    try {
      const updatedContacts = await ajouterContact(contact);
      setContacts(updatedContacts);
      addNotification("CONTACT", contact.nom + " a été ajouté à vos contacts");
    } catch (error) {
      console.error("Error adding contact:", error);
      addNotification("ERREUR", "Erreur lors de l'ajout du contact");
    }
  };

  return (
    <button onClick={() => handleAjouterContact(contact)}>
      {" "}
      <IoIosAdd
        className="cursor-pointer text-white text-2xl"
      />
    </button>
  );
};

export default AjouterContact;
