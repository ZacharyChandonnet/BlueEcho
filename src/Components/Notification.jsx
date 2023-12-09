import { React, useEffect } from "react";
import { useUser } from "../Context/UserContext";
import { IoTrashBinSharp } from "react-icons/io5";

// Notification apparaît dans le header et permet d'afficher d'anciennes notifications et de les supprimer.
const Notification = () => {
  const { notifications, addNotification, removeNotification } = useUser();

  // Fonction qui permet de supprimer une notification
  const handleRemoveNotification = (type) => {
    removeNotification(type);
  };

  // Fonction qui permet de tronquer (raccourcir) le texte d'une notification si celui-ci est trop long.
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  useEffect(() => {
    // Efface automatiquement les notifications après une minute
    notifications.forEach((notif) => {
      const timeout = setTimeout(() => {
        handleRemoveNotification(notif.id);
      }, 8000); // 8000 millisecondes = 8 secondes

      return () => clearTimeout(timeout);
    });
  }, [notifications]);

  // Si le tableau de notifications est vide, un message s'affiche.
  // Le type n'est pas affiché textuellement mais peut être utilisé pour le css.
  return (
    <div className="notification-container z-30">
      {notifications.length > 0 && notifications.map((notif, index) => (
        <div key={index} className="notification-item">
          <p>{truncateText(notif.content, 50)}</p>
          <button className="pl-4" onClick={() => handleRemoveNotification(notif.id)}>
            <IoTrashBinSharp />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;
