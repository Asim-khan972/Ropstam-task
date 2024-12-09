import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Home: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth); // Access token from Redux store

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="text-center p-6 max-w-md md:max-w-3xl lg:max-w-5xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
          Welcome to Our Application!
        </h1>
        <p className="text-lg md:text-xl text-gray-700">
          Experience a seamless interface across mobile, tablet, and laptop
          devices.
        </p>
        <div className="mt-6">
          <Link to={token ? "/dashboard" : "/login"}>
            <button className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded transition duration-300">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
