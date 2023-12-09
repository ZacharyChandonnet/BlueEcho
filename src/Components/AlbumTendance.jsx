import React, { useState, useEffect } from "react";
import fetchJsonp from "fetch-jsonp";
import { Link, Outlet } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import Loading from "../Animations/loading.json";
import './Tendance.css'
import {useUser} from "../Context/UserContext"

const Podcast = () => {
  const [data, setData] = useState([]);
 const {openTendance, setOpenTendance} = useUser();
  

  const handleTendance = () => {
    setOpenTendance(!openTendance);
  }

  useEffect(() => {
    fetchJsonp("https://api.deezer.com/chart/0/albums?output=jsonp")
      .then((response) => response.json())
      .then((result) => {
        if (result.data) {
          setData(result.data);
        }
      })
      .catch((error) => {
        console.error("JSONP request error", error);
      });
  }, []);

  console.log(openTendance)

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="w-11/12 m-auto pb-36">
        <h1 className="text-white text-4xl font-bold pt-36 mb-10 pb-10 border-b border-white">Albums tendances</h1>
        {data.length > 0 ? (
          <div className="lg:gridTendance flex flex-col justify-center items-start">
            {data.map((album, index) => (
              <div key={album.id} className="w-full" onClick={handleTendance}>
                <Link to={`/trending/${album.id}`} className="flex justify-start items-center my-4 rounded-xl w-full"
                  style={{
                    backgroundImage: `url(${album.cover_medium})`, backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}>
                  <div className=" flex justify-start items-center backdrop-blur-[10em] py-2 px-6 w-full h-full rounded-xl">
                    <span className="mr-8 font-bold">{index + 1}</span>
                    <div className="flex flex-row justify-center items-center">
                      <img src={album.cover_medium} alt={album.title} className="rounded-xl w-24 mr-4" />
                      <p className="font-medium text-lg">{album.title}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="absolute top-0 left-0 w-screen h-screen bg-black flex justify-center items-center">
            <Player autoplay mute loop src={Loading} className="w-32" />
          </div>
        )}
        {openTendance? (
          <Outlet />
        ): null}
      </div>
    </div>
  );
};

export default Podcast;
