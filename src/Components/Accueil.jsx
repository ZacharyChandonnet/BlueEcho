import React, { useState, useEffect } from "react";
import fetchJsonp from "fetch-jsonp";
import { Link } from "react-router-dom";
import { IoIosClose } from "react-icons/io";

import "./Accueil.css";

const Accueil = () => {
  const [data, setData] = useState([]);
  const [radios, setRadios] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState(null);
  const nombreRadiosAChoisir = 14;

  const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

  let supportsPassive = false;
  try {
    window.addEventListener(
      "test",
      null,
      Object.defineProperty({}, "passive", {
        get: function () {
          supportsPassive = true;
        },
      })
    );
  } catch (e) {}

  const wheelOpt = supportsPassive ? { passive: false } : false;
  const wheelEvent =
    "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

  useEffect(() => {
    const fetchDeezerTracks = () => {
      fetchJsonp(`https://api.deezer.com/radio&output=jsonp`)
        .then((response) => response.json())
        .then((result) => {
          if (result.data) {
            setData(result.data);
            const radiosAleatoires = [];
            const radiosCopie = [...result.data];
            for (let i = 0; i < nombreRadiosAChoisir; i++) {
              const indiceAleatoire = Math.floor(
                Math.random() * radiosCopie.length
              );
              radiosAleatoires.push(radiosCopie.splice(indiceAleatoire, 1)[0]);
            }
            setRadios(radiosAleatoires);
          }
        })
        .catch((error) => {
          console.error("JSONP request error", error);
        });
    };

    fetchDeezerTracks();
  }, []);

  const handleRadioClick = (radio) => {
    setSelectedRadio(radio);
    disableScroll();
  };

  const closePopup = () => {
    setSelectedRadio(null);
    enableScroll();
  };

  const TruncatedTitle = ({ title, maxLength }) => {
    const truncatedTitle =
      title.length > maxLength
        ? `${title.substring(0, maxLength)} [...]`
        : title;

    return (
      <h3 className="text-white text-md mb-2 font-semibold w-52 leading-none">
        {truncatedTitle}
      </h3>
    );
  };

  // Fonctions de désactivation et de réactivation du défilement
  const preventDefault = (e) => {
    e.preventDefault();
  };

  const preventDefaultForScrollKeys = (e) => {
    if (keys[e.keyCode]) {
      preventDefault(e);
      return false;
    }
  };

  const disableScroll = () => {
    document.body.style.overflow = "hidden";
  };

  const enableScroll = () => {
    console.log("enable scroll");
    document.body.style.overflow = "auto";
  };

  return (
    <div>
      <div className="-z-10 fixed w-screen h-screen headerAccueil"></div>
      <header className="h-screen relative justify-center flex items-center">
        <div className="justify-center flex flex-col items-center m-1 overflow-hidden">
          <img
            src="/assets/Logos/Full_white.svg"
            alt=""
            className="absolute z-10 w-10/12 m-auto md:w-9/12 lg:w-5/12 transition-all duration-100 xl:w-4/12"
          />
          <video
            className="w-screen h-screen object-cover"
            autoPlay
            loop
            muted
            src="/assets/video/headerAccueil.mp4"
          ></video>
        </div>
      </header>
      <div className="bg-black mx-1">
        <h2 className="text-4xl font-bold text-white w-11/12 pt-10 m-auto mb-10">
          À la une
        </h2>
        <style>
          {`
            .popup-container {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: #000000a2;
              backdrop-filter: blur(10px);
              width: 100%;
              height: 100%;
              z-index: 100;
            }
            .popup {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: #19B6D9;
              color: white;
              padding: 20px;
              border-radius: 20px;
              z-index: 100;
              backdrop-blur: blur(50px);
            }
          `}
        </style>
        <ul className=" grilleDecouverte w-11/12 mx-auto cursor-pointer text-white text-sm">
          {radios.map((radio) => (
            <li key={radio.id} onClick={() => handleRadioClick(radio)}>
              <TruncatedTitle title={radio.title} maxLength={18} />
              {/* <h3>{radio.title}</h3> */}
              <img
                src={radio.picture_big}
                alt={radio.title}
                className="w-full"
              />
            </li>
          ))}
        </ul>
      </div>

      {selectedRadio && (
        <div className="popup-container w-9/12 sm:w-7/12 md:w-5/12 lg:w-4/12 xl:w-3/12">
          <div className="popup flex flex-col justify-center items-center py-4 px-4">
            <button
              onClick={closePopup}
              className="flex justify-end items-center w-full text-4xl"
            >
              <IoIosClose />
            </button>
            <h1 className="text-xl md:text-2xl xl:text-3xl w-5/6 text-center font-bold mb-6">
              Testez notre service avec un compte BlueEcho{" "}
            </h1>
            <h3 className="mb-2 text-lg xl:text-xl">{selectedRadio.title}</h3>
            <img
              src={selectedRadio.picture_medium}
              alt={selectedRadio.title}
              className="rounded-xl"
            />
            <Link to="/login" className="text-xl mt-6 mb-4 py-2 px-6 sm:px-8 border-2 rounded-full border-white text-center hover:bg-mauve200 hover:border-mauve200">Connexion</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accueil;
