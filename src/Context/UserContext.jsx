import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import fetchJsonp from "fetch-jsonp";
import { db } from "../Config/firebase";
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  query,
  where,
  orderBy,
  getDocs,
  or,
} from "firebase/firestore";

const UserContext = createContext({
  updateUser: async () => {},
  ajouterPlaylist: async () => {},
  getPlaylistDetails: async () => {},
  deletePlaylist: async () => {},
  ajouterMusiqueSelonPlaylist: async () => {},
  removeMusiqueSelonPlaylist: async () => {},
  changerNomPlaylist: async () => {},
  changerOrdreMusiques: async () => {},
  user: null,
  _v: 0,
  ajouterPisteListePistes: async () => {},
  supprimerPisteListePistes: async () => {},
  changerOrdrePistes: async () => {},
  getPistesListePistes: async () => {},
  rechercherUserNom: async () => {},
  ajouterContact: async () => {},
  afficherContacts: async () => {},
  retirerContact: async () => {},
  currentlyPlaying: async () => {},
  clearCurrentlyPlaying: async () => {},
  notifications: async () => {},
  addNotification: async () => {},
  removeNotification: async () => {},
  setIsExpanded: async () => {},
  setOpenTendance: async () => {},
  openTendance: async () => {},
  totalMusiqueEcoutees: async () => {},
});

const useUser = () => {
  const context = useContext(UserContext);
  if (context._v === 0) {
    throw new Error("useUser doit être utilisé dans un UserProvider");
  }
  return context;
};

export function UserProvider({ children }) {
  const { user } = useAuth();
  const [listePistesId, setListePistesId] = useState(null); // L'ID de la liste de pistes de l'utilisateur, bref l'historique
  const [notifications, setNotifications] = useState([]); // Liste des notifications d'un utilisateur
  const [userInfos, setUserInfos] = useState(null);
  const maxNotifications = 4; // Nombre maximum de notifications à afficher. Si l'utilisateur a plus de notifications, les plus anciennes seront supprimées.
  const [isExpanded, setIsExpanded] = useState(false);
  const [openTendance, setOpenTendance] = useState(false);
  // Fonction pour générer un ID unique. Fonctionne comme la méthode utilisée pour playlist.
  const generateUniqueId = () => {
    return new Date().getTime().toString();
  };

  const totalMusiqueEcoutees = async (incrementBy) => {
    try {
      const uuid = user.uid;
      const userDocRef = doc(db, "users", uuid);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const currentTotal = userDoc.data().musiqueEcoutee || 0;
        const newTotal = currentTotal + incrementBy;
  
        await updateDoc(userDocRef, { musiqueEcoutee: newTotal });
  
        setUserInfos((prevUserInfos) => ({
          ...prevUserInfos,
          musiqueEcoutee: newTotal,
        }));
  
        console.log(`Total musique ecoutee updated to: ${newTotal}`);
      } else {
        console.error("User document not found");
      }
    } catch (error) {
      console.error("Error updating total musique ecoutee:", error);
    }
  };
  
  

  // À appeler lorsque l'on souhaite ajouter une notification à la base de données.
  // On n'est pas obligé d'afficher le type de notification, mais on peut l'utiliser pour du css.
  const addNotification = async (type, content) => {
    try {
      const notificationDocRef = doc(db, "notifications", user.uid);
      const notificationDoc = await getDoc(notificationDocRef);

      let updatedNotifications = [];

      if (notificationDoc.exists()) {
        const data = notificationDoc.data();
        updatedNotifications = [
          ...(data.listeNotifications || []),
          { id: generateUniqueId(), type, content }, // Ajout de l'ID unique à la notification
        ];

        // Limiter le nombre de notifications à maxNotifications (4)
        if (updatedNotifications.length > maxNotifications) {
          updatedNotifications = updatedNotifications.slice(-maxNotifications);
        }

        // Mettre à jour la liste dans la base de données avec les nouvelles notifications
        await updateDoc(notificationDocRef, {
          listeNotifications: updatedNotifications,
        });
      } else {
        updatedNotifications = [{ id: generateUniqueId(), type, content }];
        await setDoc(notificationDocRef, {
          userId: user.uid,
          listeNotifications: updatedNotifications,
        });
      }

      // Mise à jour de l'état local après l'ajout
      setNotifications(updatedNotifications);

      console.log(
        "Ajout d'une notification : ",
        content,
        "avec le type : ",
        type,
        "dans la base de données."
      );
    } catch (error) {
      console.error("Erreur lors de l'ajout de la notification:", error);
      // Gére les erreurs
    }
  };

  // Efface une notification de la base de données selon son ID
  const removeNotification = async (id) => {
    try {
      const notificationDocRef = doc(db, "notifications", user.uid);
      const notificationDoc = await getDoc(notificationDocRef);

      if (notificationDoc.exists()) {
        const data = notificationDoc.data();
        const updatedNotifications = data.listeNotifications.filter(
          (notif) => notif.id !== id
        );

        await updateDoc(notificationDocRef, {
          listeNotifications: updatedNotifications,
        });

        // Mise à jour de l'état local après la suppression
        setNotifications(updatedNotifications);
      } else {
        console.log("Aucune notification trouvée pour cet utilisateur.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error);
      // Gére les erreurs
    }
  };

  // Récupére les notifications depuis Firebase pour mettre à jour l'état local
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationDocRef = doc(db, "notifications", user.uid);
        const notificationDoc = await getDoc(notificationDocRef);

        if (notificationDoc.exists()) {
          const data = notificationDoc.data();
          const fetchedNotifications = data.listeNotifications || [];
          setNotifications(fetchedNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const createListePistesForUser = async (userId) => {
    try {
      // Créer une nouvelle liste de pistes pour l'utilisateur
      const listePistesCollectionRef = collection(db, "listePistes");
      {
        console.log("Liste de pistes créée avec succès");
      }
      const newListePistesDocRef = await addDoc(listePistesCollectionRef, {
        userId: userId,
        musiques: [], // Initialiser la liste de pistes comme un tableau vide
      });

      // Récupérer l'ID de la nouvelle liste de pistes créée
      const createdListePistesId = newListePistesDocRef.id;

      // Mettre à jour les données de l'utilisateur pour stocker l'ID de la liste de pistes
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        listePistesId: createdListePistesId,
      });

      // Mettre à jour l'état avec l'ID de la liste de pistes nouvellement créée
      setListePistesId(createdListePistesId);
    } catch (error) {
      console.error("Error creating ListePistes for user:", error);
      // Gérer les erreurs
    }
  };

  useEffect(() => {
    const getDocRef = async () => {
      const uuid = user.uid;
      const docRef = doc(db, "users", uuid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserInfos(docSnap.data());
        if (!docSnap.data().listePistesId) {
          createListePistesForUser(uuid);
        } else {
          setListePistesId(docSnap.data().listePistesId);
        }
      } else {
        try {
          await setDoc(docRef, {
            nom: user.displayName,
            photo: user.photoURL,
            email: user.email,
            uuid: user.uid,
            favoris: [],
            playlists: [],
            contacts: [],
            dateInscription: new Date(),
            
          });

          createListePistesForUser(uuid);
        } catch (error) {
          console.error("Error creating user document:", error);
        }
      }
    };

    if (user) {
      getDocRef();
    }
  }, [user]);

  const ajouterPisteListePistes = async (piste, listePistesId) => {
    try {
      const listePistesDocRef = doc(db, "listePistes", listePistesId);
      const listePistesDoc = await getDoc(listePistesDocRef);

      if (listePistesDoc.exists()) {
        const listePistesData = listePistesDoc.data();
        const musiques = listePistesData.musiques;
        // Utilisation de la méthode arrayUnion pour ajouter la nouvelle piste à la liste existante
        await updateDoc(listePistesDocRef, {
          musiques: arrayUnion(piste), // Assurez-vous que piste est un objet valide à ajouter dans la liste
        });

        console.log("Piste ajoutée avec succès à la liste de pistes.");
      } else {
        throw new Error("ListePistes not found");
      }
    } catch (error) {
      console.error("Error adding track to ListePistes:", error);
      // Gérer les erreurs
    }
  };

  const supprimerPisteListePistes = async (pisteId, listePistesId) => {
    try {
      const listePistesDocRef = doc(db, "listePistes", listePistesId);
      const listePistesDoc = await getDoc(listePistesDocRef);

      if (listePistesDoc.exists()) {
        const listePistesData = listePistesDoc.data();
        const musiques = listePistesData.musiques || []; // Assurez-vous que musiques est initialisé avec un tableau vide si elle est null ou undefined

        // Filtrer les pistes en fonction de l'ID à supprimer
        const updatedMusiques = musiques.filter((p) => p.id !== pisteId);

        // Mettre à jour le document avec les pistes filtrées
        await updateDoc(listePistesDocRef, {
          musiques: updatedMusiques,
        });

        console.log("Piste supprimée avec succès. ID :", pisteId);
      } else {
        throw new Error("ListePistes not found");
      }
    } catch (error) {
      console.error("Error removing track from ListePistes:", error);
      // Gérer les erreurs
    }
  };

  const changerOrdrePistes = async (nouvelOrdre, listePistesId) => {
    try {
      const listePistesDocRef = doc(db, "listePistes", listePistesId);
      const listePistesDoc = await getDoc(listePistesDocRef);

      if (listePistesDoc.exists()) {
        await updateDoc(listePistesDocRef, {
          musiques: nouvelOrdre,
        });
      } else {
        throw new Error("ListePistes not found");
      }
    } catch (error) {
      console.error("Error changing track order in ListePistes:", error);
      // Gérer les erreurs
    }
  };

  const getPlaylistDetails = async (playlistId) => {
    const playlistDocRef = doc(db, "playlists", playlistId);
    const playlistDoc = await getDoc(playlistDocRef);

    if (playlistDoc.exists()) {
      const playlistData = playlistDoc.data();
      const musiques = playlistData.musiques;

      const fetchTrackDetails = async (trackId) => {
        try {
          const response = await fetchJsonp(
            `https://api.deezer.com/track/${trackId}?output=jsonp`
          );
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("JSONP request error", error);
          return null;
        }
      };
      const trackDetailsPromises = musiques.map((trackId) =>
        fetchTrackDetails(trackId)
      );
      const trackDetails = await Promise.all(trackDetailsPromises);
      const playlistDetails = {
        ...playlistData,
        musiques: trackDetails.filter((details) => details !== null),
      };

      return playlistDetails;
    } else {
      throw new Error("Playlist not found");
    }
  };

  const getPistesListePistes = async (listePistesId) => {
    try {
      const listePistesDocRef = doc(db, "listePistes", listePistesId);
      const listePistesDoc = await getDoc(listePistesDocRef);

      if (listePistesDoc.exists()) {
        const listePistesData = listePistesDoc.data();
        return listePistesData.musiques; // Retourne les pistes de la liste de pistes
      } else {
        throw new Error("ListePistes not found");
      }
    } catch (error) {
      console.error("Error fetching tracks from ListePistes:", error);
      return [];
    }
  };

  const changerOrdreMusiques = async (playlistId, newOrder) => {
    try {
      const playlistDocRef = doc(db, "playlists", playlistId);
      const playlistDoc = await getDoc(playlistDocRef);

      if (playlistDoc.exists()) {
        await setDoc(playlistDocRef, {
          musiques: newOrder,
        });
      } else {
        throw new Error("Playlist not found");
      }
    } catch (error) {
      console.error("Error changing order of musiques:", error);
    }
  };

  const deletePlaylist = async (playlistId) => {
    try {
      const uuid = user.uid;
      const updatedPlaylists = userInfos.playlists.filter(
        (playlist) => playlist.uuid !== playlistId
      );

      console.log("Updated Playlists:", updatedPlaylists);

      const userDocRef = doc(db, "users", uuid);
      await setDoc(
        userDocRef,
        { playlists: updatedPlaylists },
        { merge: true }
      );

      console.log("User Document updated successfully");

      const playlistDocRef = doc(db, "playlists", playlistId);
      await deleteDoc(playlistDocRef);

      console.log("Playlist document deleted successfully");
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  const changerNomPlaylist = async (playlistId, nouveauNom) => {
    const uuid = user.uid;
    const userDocRef = doc(db, "users", uuid);
    await setDoc(
      userDocRef,
      {
        playlists: userInfos.playlists.map((playlist) => {
          if (playlist.uuid === playlistId) {
            return {
              ...playlist,
              titre: nouveauNom,
            };
          } else {
            return playlist;
          }
        }),
      },
      { merge: true }
    );
  };

  const removeMusiqueSelonPlaylist = async (musique, playlistId) => {
    const playlistDocRef = doc(db, "playlists", playlistId);
    const playlistDoc = await getDoc(playlistDocRef);
    if (playlistDoc.exists()) {
      const playlistData = playlistDoc.data();
      const musiques = playlistData.musiques;
      const updatedMusiques = musiques.filter(
        (musiqueId) => musiqueId !== musique
      );
      await setDoc(playlistDocRef, {
        musiques: updatedMusiques,
      });
    } else {
      throw new Error("Playlist not found");
    }
  };

  const ajouterMusiqueSelonPlaylist = async (musique, playlistId) => {
    const playlistDocRef = doc(db, "playlists", playlistId);
    const playlistDoc = await getDoc(playlistDocRef);
    if (playlistDoc.exists()) {
      const playlistData = playlistDoc.data();
      const musiques = playlistData.musiques;
      if (!musiques.includes(musique)) {
        const updatedMusiques = [...musiques, musique];
        await setDoc(playlistDocRef, {
          musiques: updatedMusiques,
        });
      }
    } else {
      throw new Error("Playlist not found");
    }
  };

  const ajouterPlaylist = async (titre) => {
    const uuid = user.uid;
    const playlistId = genererId();
    const userDocRef = doc(db, "users", uuid);
    await setDoc(
      userDocRef,
      {
        playlists: [
          ...userInfos.playlists,
          {
            uuid: playlistId,
            titre: titre,
          },
        ],
      },
      { merge: true }
    );

    const playlistCollectionRef = collection(db, "playlists");
    await setDoc(doc(playlistCollectionRef, playlistId), {
      uuid: playlistId,
      titre: titre,
      userId: uuid,
      musiques: [],
    });
  };

  useEffect(() => {
    const getDocRef = async () => {
      const uuid = user.uid;
      const docRef = doc(db, "users", uuid);
      const unsub = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setUserInfos(doc.data());
        } else {
          setDoc(docRef, {
            nom: user.displayName,
            photo: user.photoURL,
            email: user.email,
            uuid: user.uid,
            favoris: [],
            playlists: [],
            contacts: [],
            dateInscription: new Date(),
          });
        }
      });
      return unsub;
    };
    if (user) {
      getDocRef();
    }
  }, [user]);

  const rechercherUserNom = async (searchTerm) => {
    try {
      const usersCollectionRef = collection(db, "users");
      const bonjour = query(
        usersCollectionRef,
        where("email", ">=", searchTerm.trim().toLowerCase()),
        where("email", "<", searchTerm.trim().toLowerCase() + '\uf8ff')
    );
      const querySnapshot = await getDocs(bonjour,);
      const users = querySnapshot.docs.map((doc) => doc.data());
      console.log(users,searchTerm.trim().toLowerCase());

      return users;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  };

  const ajouterContact = async (contact) => {
    try {
      const uuid = user.uid;
      const userDocRef = doc(db, "users", uuid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const contacts = userData.contacts || [];

        // Vérifier si le contact n'existe pas déjà dans la liste
        const contactExists = contacts.some(
          (existingContact) => existingContact.uuid === contact.uuid
        );

        if (!contactExists) {
          const updatedContacts = [...contacts, contact];
          await updateDoc(userDocRef, { contacts: updatedContacts });
          await createNotificationForUser(
            contact.uuid,
            `Vous avez été ajouté aux contacts par ${userData.nom}`
          );
        } else {
          console.warn("Le contact existe déjà dans la liste.");
        }
      } else {
        console.error("User document not found");
      }
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const afficherContacts = async () => {
    try {
      const uuid = user.uid;
      const userDocRef = doc(db, "users", uuid);
      const userDocSnapshot = await getDoc(userDocRef);
      const updatedContacts = [];

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const contacts = userData.contacts || [];

        for (const contact of contacts) {
          const contactDocRef = doc(db, "users", contact.uuid);
          const contactDocSnapshot = await getDoc(contactDocRef);

          if (contactDocSnapshot.exists()) {
            const contactData = contactDocSnapshot.data();
            const currentlyPlaying = contactData.currentlyPlaying;

            updatedContacts.push({
              ...contact,
              currentlyPlaying,
              playlists: contactData.playlists,
            });
          } else {
            console.error("Contact document not found");
          }
        }
      } else {
        console.error("User document not found");
      }

      return updatedContacts;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  };

  const retirerContact = async (contact) => {
    try {
      const uuid = user.uid;
      const userDocRef = doc(db, "users", uuid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const contacts = userData.contacts || [];
        const updatedContacts = contacts.filter(
          (existingContact) => existingContact.email !== contact.email
        );
        await updateDoc(userDocRef, { contacts: updatedContacts });
      } else {
        console.error("User document not found");
      }
    } catch (error) {
      console.error("Error removing contact:", error);
    }
  };

  // Ajouter un drapeau pour suivre les notifications créées pour chaque utilisateur
  const notificationsCreated = new Set();

  const createNotificationForUser = async (userId, content) => {
    try {
      if (notificationsCreated.has(userId)) {
        console.log(
          "Notification déjà créée pour l'utilisateur avec l'ID:",
          userId
        );
        return; // Sortir de la fonction si la notification a déjà été créée
      }

      const notificationDocRef = doc(db, "notifications", userId);
      const notificationDoc = await getDoc(notificationDocRef);

      let updatedNotifications = [];

      if (notificationDoc.exists()) {
        const data = notificationDoc.data();
        const existingNotifications = data.listeNotifications || [];

        const similarNotification = existingNotifications.find(
          (notification) =>
            notification.content === content &&
            notification.type === "CONTACT_ADD"
        );

        if (!similarNotification) {
          updatedNotifications = [
            ...existingNotifications,
            { id: generateUniqueId(), type: "CONTACT_ADD", content },
          ];

          if (updatedNotifications.length > maxNotifications) {
            updatedNotifications = updatedNotifications.slice(
              -maxNotifications
            );
          }

          await updateDoc(notificationDocRef, {
            listeNotifications: updatedNotifications,
          });

          console.log(
            "Notification créée pour l'utilisateur avec l'ID:",
            userId
          );
          notificationsCreated.add(userId); // Marquer l'utilisateur comme notifié
        } else {
          console.log(
            "Notification similaire déjà existante pour l'utilisateur avec l'ID:",
            userId
          );
        }
      } else {
        updatedNotifications = [
          { id: generateUniqueId(), type: "CONTACT_ADD", content },
        ];
        await setDoc(notificationDocRef, {
          userId,
          listeNotifications: updatedNotifications,
        });

        console.log(
          "Première notification créée pour l'utilisateur avec l'ID:",
          userId
        );
        notificationsCreated.add(userId); // Marquer l'utilisateur comme notifié
      }
    } catch (error) {
      console.error(
        "Erreur lors de la création de la notification pour l'utilisateur avec l'ID:",
        userId,
        "Erreur:",
        error
      );
      // Gérer les erreurs
    }
  };

  const currentlyPlaying = async (musique) => {
    try {
      const uuid = user.uid;
      const userDocRef = doc(db, "users", uuid);
      await updateDoc(userDocRef, { currentlyPlaying: musique });
    } catch (error) {
      console.error("Error updating currently playing:", error);
    }
  };

  const onQuerySnapshot = async (querySnapshot) => {
    const updatedContacts = [];
    const updatedUsers = [];

    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      const currentlyPlaying = data.currentlyPlaying;
      const playlists = data.playlists;

      if (currentlyPlaying) {
        if (data.uuid === user.uid) {
          setUserInfos((prevUserInfos) => ({
            ...prevUserInfos,
            currentlyPlaying,
          }));
        } else {
          updatedContacts.push({ ...data, currentlyPlaying, playlists });
        }
      }

      updatedUsers.push({ ...data, playlists });
      // Vérifiez si l'utilisateur n'a pas de liste de pistes et créez-en une s'il n'y en a pas
      if (!data.listePistesId) {
        try {
          await createListePistesForUser(data.uuid);
        } catch (error) {
          console.error("Error creating ListePistes for user:", error);
        }
      }
    }

    setUserInfos((prevUserInfos) => ({
      ...prevUserInfos,
      contacts: updatedContacts,
    }));
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), onQuerySnapshot);

    return () => {
      unsubscribe();
    };
  }, [user]);

  const clearCurrentlyPlaying = async () => {
    try {
      const uuid = user.uid;
      const userDocRef = doc(db, "users", uuid);
      await updateDoc(userDocRef, { currentlyPlaying: null });
    } catch (error) {
      console.error("Error clearing currently playing:", error);
    }
  };

  const genererId = () => {
    return new Date().getTime().toString();
  };

  return (
    <UserContext.Provider
      value={{
        user: userInfos,
        ajouterPlaylist,
        getPlaylistDetails,
        ajouterMusiqueSelonPlaylist,
        removeMusiqueSelonPlaylist,
        changerNomPlaylist,
        deletePlaylist,
        changerOrdreMusiques,
        ajouterPisteListePistes,
        supprimerPisteListePistes,
        changerOrdrePistes,
        getPistesListePistes,
        rechercherUserNom,
        ajouterContact,
        afficherContacts,
        retirerContact,
        currentlyPlaying,
        clearCurrentlyPlaying,
        notifications,
        addNotification,
        removeNotification,
        createListePistesForUser,
        setIsExpanded,
        isExpanded,
        openTendance,
        setOpenTendance,
        totalMusiqueEcoutees,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { useUser };
