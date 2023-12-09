import React, { useState, useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ListeRecherche from "./Components/ListeRecherche";
import Connexion from "./Components/Connexion";
import { useAuth } from "./Context/AuthContext";
import Layout from "./Components/Layout";
import LayoutAuth from "./Components/LayoutAuth";
import Profil from "./Components/Profil";
import Accueil from "./Components/Accueil";
import Decouverte from "./Components/Decouverte";
import Playlist from "./Components/Playlist";
import Contact from "./Components/Contact";
import DetailsPlaylist from "./Components/DetailsPlaylist";
import { AudioProvider } from "./Musique/AudioManager";
import LecteurAudio from "./Components/LecteurAudio";
import Historique from "./Components/Historique";
import AlbumTendance from "./Components/AlbumTendance";
import DetailsTendance from "./Components/DetailsTendance";
import Artist from "./Components/Artist";

const App = () => {
  const [query, setQuery] = useState("");
  const { user } = useAuth();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [cover, setCover] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);

  useEffect(() => {
    const fetchCover = async () => {
      const response = await fetch("https://picsum.photos/200/300");
      const data = await response.blob();
      const cover = URL.createObjectURL(data);
      setCover(cover);
    };
    fetchCover();
  }, []);

  const routes = [
    {
      path: "/",
      element: <LayoutAuth />,
      children: [
        {
          path: "accueil",
          element: <Accueil />,
        },
        {
          path: "login",
          element: <Connexion />,
        },
        {
          path: "",
          element: <Navigate to="/accueil" replace />,
        },
      ],
    },
    {
      path: "*",
      element: (
        <Navigate to={user === null ? "/accueil" : "/recherche"} replace />
      ),
    },
  ];

  const routesLogged = [
    {
      path: "/",
      element: (
        <AudioProvider>
          <>
            <LecteurAudio
              track={currentTrack}
              playlistTracks={playlistTracks}
            />
            <Layout />
          </>
        </AudioProvider>
      ),
      children: [
        {
          path: "recherche",
          element: (
            <ListeRecherche
              query={query}
              setQuery={setQuery}
              setCurrentTrack={setCurrentTrack}
            />
          ),
        },
        {
          path: "profil",
          element: <Profil />,
        },
        {
          path: "decouverte",
          element: <Decouverte />,
        },
        {
          path: "playlist",
          element: <Playlist cover={cover} />,
          children: [
            {
              path: ":playlistId",
              element: (
                <DetailsPlaylist
                  setCurrentTrack={setCurrentTrack}
                  playlistTracks={playlistTracks}
                  setPlaylistTracks={setPlaylistTracks}
                  cover={cover}
                />
              ),
            },
          ],
        },
        {
          path: "contact",
          element: <Contact setCurrentTrack={setCurrentTrack} cover={cover} />,
        },
        {
          path: "historique",
          element: <Historique setCurrentTrack={setCurrentTrack} />,
        },
        {
          path: "trending",
          element: <AlbumTendance />,
          children: [
            {
              path: ":trendingId",
              element: <DetailsTendance setCurrentTrack={setCurrentTrack} />,
            },
          ],
        },
        {
          path: "artist/:artistId",
          element: <Artist setCurrentTrack={setCurrentTrack} />,
        },
        {
          path: "recherche/:trackId", // Ajout de la route avec le paramètre de l'ID de la chanson
          element: (
            <ListeRecherche
              query={query}
              setQuery={setQuery}
              setCurrentTrack={setCurrentTrack}
            />
          ),
        },
        {
          path: "",
          element: <Navigate to="/profil" replace />,
        },
      ],
    },
    {
      path: "*",
      element: (
        <Navigate to={user === null ? "/login" : "/recherche"} replace />
      ),
    },
  ];

  return (
    <RouterProvider
      router={createBrowserRouter(user === null ? routes : routesLogged)}
    />
  );
};

export default App;
