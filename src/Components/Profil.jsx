import { useUser } from "../Context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import "./Profil.css";
import { GrLogout } from "react-icons/gr";
import { useAuth } from "../Context/AuthContext";
import { useAudio } from "../Musique/AudioManager";
import { Player } from "@lottiefiles/react-lottie-player";
import Loading from "../Animations/loading.json";
import moment from "moment";
import "moment/locale/fr";

const Profil = () => {
  moment.locale("fr");
  const { user, dateInscription, totalMusiqueEcoutees } = useUser();

  if (!user) {
    return (
      <div className="absolute top-0 left-0 w-screen h-screen bg-black flex justify-center items-center">
        <Player autoplay mute loop src={Loading} className="w-32" />
      </div>
    );
  }
  const formattedDateInscription = moment(dateInscription)
    .locale("fr")
    .format("Do MMMM YYYY");

  console.log(user.musiqueEcoutee);

  const calculateFanLevel = () => {
    const currentDate = moment();
    const registrationDate = moment(dateInscription);
    const daysSinceRegistration = currentDate.diff(registrationDate, "days");

    if (daysSinceRegistration < 30) {
      return (
        <div className="flex flex-col mb-14 md:flex-row md:justify-between">
          <div className="flex flex-col justify-start items-start mb-14 md:mb-0 lg:mr-20 xl:mr-0">
            <p className="text-xl font-bold mb-8 xl:text-2xl">Niveau de fan:</p>
            <div className="flex flex-col justify-center md:justify-center items-center w-full">
              <p className="font-bold text-4xl mb-4">Fan</p>
              <img
                src="/assets/img/Fan.png"
                alt="fanBadge"
                className="w-64 md:w-80 rotate lg:w-96 xl:w-80 2xl:w-96"
              />
            </div>
          </div>
          <div className="md:flex md:flex-col md:justify-end md:items-start md:w-52 lg:w-44 2xl:w-64">
            <p className="text-md font-light mb-8 xl:text-lg 2xl:text-xl">
              Jalons à venir:
            </p>
            <div className="flex flex-row justify-around md:justify-between items-center md:w-full">
              <div className="flex flex-col justify-center items-center">
                <img
                  src="/assets/img/SuperFan.png"
                  alt="superFanBadge"
                  className="w-14 mb-2 md:w-20 lg:w-12  xl:w-14 2xl:w-24 rotate"
                />
                <p className="font-bold text-center xl:text-lg">Super Fan</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <img
                  src="/assets/img/HyperFan.png"
                  alt="hyperFanBadge"
                  className="w-14 mb-2 md:w-20 lg:w-12 xl:w-14 2xl:w-24 rotate"
                />
                <p className="font-bold text-center xl:text-lg">Hyper Fan</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (daysSinceRegistration < 60) {
      <div className="flex flex-col mb-14 md:justify-between">
        <p className="text-xl font-bold mb-8 xl:text-2xl">Niveau de fan:</p>
        <div className="flex flex-row justify-between lg:items-end items-center mb-14 md:mb-0">
          <div className="md:flex w-full md:flex-col md:justify-center md:items-center md:w-52 lg:w-44 2xl:w-64">
            <p className="text-md font-light text-center mb-4 md:mb-8 xl:text-lg 2xl:text-xl">
              Jalon récupéré:
            </p>
            <div className="flex flex-row justify-around md:justify-center items-center md:w-full">
              <div className="flex flex-col justify-center items-center">
                <img
                  src="/assets/img/Fan.png"
                  alt="FanBadge"
                  className="w-14 mb-2 md:w-20 lg:w-12  xl:w-14 2xl:w-24 rotate"
                />
                <p className="font-bold text-center xl:text-lg">Fan</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center md:justify-center items-center w-full">
            <p className="font-bold text-4xl mb-4">Super Fan</p>
            <img
              src="/assets/img/SuperFan.png"
              alt="superFanBadge"
              className="w-36 md:w-56 rotate lg:w-48 xl:w-56 2xl:w-80"
            />
          </div>
          <div className="md:flex w-full md:flex-col md:justify-center md:items-center md:w-52 lg:w-44 2xl:w-64">
            <p className="text-md font-light text-center mb-4 md:mb-8 xl:text-lg 2xl:text-xl">
              Jalon à venir:
            </p>
            <div className="flex flex-row justify-around md:justify-center items-center md:w-full">
              <div className="flex flex-col justify-center items-center">
                <img
                  src="/assets/img/HyperFan.png"
                  alt="hyperFanBadge"
                  className="w-14 mb-2 md:w-20 lg:w-12  xl:w-14 2xl:w-24 rotate"
                />
                <p className="font-bold text-center xl:text-lg">Hyper Fan</p>
              </div>
            </div>
          </div>
        </div>
      </div>;
    } else {
      <div className="flex flex-col mb-14 md:flex-row md:justify-between">
        <div className="flex flex-col justify-start items-start mb-14 md:mb-0 lg:mr-20 xl:mr-0">
          <p className="text-xl font-bold mb-8 xl:text-2xl">Niveau de fan:</p>
          <div className="flex flex-col justify-center md:justify-center items-center w-full">
            <p className="font-bold text-4xl mb-4">Hyper Fan</p>
            <img
              src="/assets/img/HyperFan.png"
              alt="hyperFanBadge"
              className="w-64 md:w-80 rotate lg:w-96 xl:w-80 2xl:w-96"
            />
          </div>
        </div>
        <div className="md:flex md:flex-col md:justify-end md:items-start md:w-52 lg:w-44 2xl:w-64">
          <p className="text-md font-light mb-8 xl:text-lg 2xl:text-xl">
            Jalons récupérés:
          </p>
          <div className="flex flex-row justify-around md:justify-between items-center md:w-full">
            <div className="flex flex-col justify-center items-center">
              <img
                src="/assets/img/Fan.png"
                alt="FanBadge"
                className="w-14 mb-2 md:w-20 lg:w-12  xl:w-14 2xl:w-24 rotate"
              />
              <p className="font-bold text-center xl:text-lg">Fan</p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <img
                src="/assets/img/SuperFan.png"
                alt="superFanBadge"
                className="w-14 mb-2 md:w-20 lg:w-12 xl:w-14 2xl:w-24 rotate"
              />
              <p className="font-bold text-center xl:text-lg">Super Fan</p>
            </div>
          </div>
        </div>
      </div>;
    }
  };

  const navigate = useNavigate();
  const handleVersListe = () => {
    navigate("/playlist");
  };

  const handleVersLecture = () => {
    navigate("/historique");
  };

  const handleVersContact = () => {
    navigate("/contact");
  };

  const handleVersTendance = () => {
    navigate("/trending");
  };

  const { logout } = useAuth();
  const { isReady, stop } = useAudio();

  const handleLogoutAndStop = () => {
    stop(); // Arrête la musique
    logout(); // Déconnecte l'utilisateur
  };

  return (
    <div className="flex flex-col justify-between h-screen items-center relative">
      <div className="bg-black h-screen w-screen fixed -z-10">
        <img
          src="/src/assets/Logos/Full_ico_white.svg"
          alt="logo"
          className="absolute z-0 w-[800px] rotate-45 -top-[150px] -right-[100px] opacity-[25%]"
        />
      </div>
      <div className="w-11/12 pt-4 mb-24 z-10">
        <div className="flex justify-between items-center">
          <div className="flex justify-end items-center flex-row-reverse">
            <p className="text-3xl font-bold ml-4 colorNom text-white">
              {user.nom}
            </p>
            <img className="rounded-full w-14" src={user.photo} alt="avatar" />
          </div>
          <button onClick={handleLogoutAndStop}>
            <GrLogout className="text-white text-2xl lg:hidden" />
          </button>
        </div>
        <div className="gridScreenLarge">
          <div>
            <section className="mt-16 w-full">
              <h2 className="text-white text-4xl font-bold mb-8">Mon profil</h2>
              <div className="text-white gridProfil">
                <div
                  onClick={handleVersContact}
                  className="bg-rose100 hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  <div className="flex">
                    <h2 className="text-2xl font-bold text-center">
                      Mes contacts
                    </h2>
                    <p className="text-white"></p>
                  </div>
                </div>
                <div
                  onClick={handleVersLecture}
                  className="bg-mauve200 hover:scale-105 transition-transform duration-300  cursor-pointer"
                >
                  <p className="text-2xl font-bold">Historique</p>
                </div>
                <div
                  onClick={handleVersListe}
                  className="bg-bleu200 hover:scale-105 transition-transform duration-300  cursor-pointer"
                >
                  <p className="text-4xl font-bold">Mes listes</p>
                </div>
                <div
                  onClick={handleVersTendance}
                  className="bg-bleu100 hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  <p className="text-2xl font-bold text-center">
                    Albums Tendances
                  </p>
                </div>
              </div>
            </section>
          </div>
          <div className="text-white mt-16 w-full mb-24">
            <h2 className="text-white text-4xl font-bold mb-8">Statistiques</h2>
            <div className="h-full flex flex-col justify-between items-between">
              <>{calculateFanLevel()}</>
              <div className="gridStat">
                <p>
                  Nombre de playlists :{" "}
                  <span className="font-bold text-xl">
                    {user.playlists ? user.playlists.length : 0}
                  </span>
                </p>
                <p>
                  Nombre de pistes écoutées :{" "}
                  <span className="font-bold text-xl">
                    {user.musiqueEcoutee || 0}
                  </span>
                </p>
                <p>
                  Inscrit{" "}
                  <span className="font-bold text-xl">
                    depuis {formattedDateInscription}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="lg:bg-neutral-900 xs:text-sm w-full text-white pb-32 lg:py-2 lg:px-4 lg:flex-row lg:justify-between xl:justify-around flex flex-col justify-start items-center">
        <p>&copy; 2023 BlueEcho. Tous droits réservés.</p>
        <p>Web 5 - Cégep de Saint- Jérôme</p>
        <p className="text-center">
          Oli Boucher - Zachary Chandonnet - Camilien Provencher
        </p>
      </footer>
    </div>
  );
};

export default Profil;
