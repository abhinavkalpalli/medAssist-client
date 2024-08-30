import React from "react";
import { Link } from "react-router-dom";
import { FaComments, FaUser } from "react-icons/fa";
import profileHolder from "../../assets/Med Assist.png";
function Doctorhead() {
  return (
    <header className="bg-gray-300 z-10 ml-0">
      <div className="max-w-7xl flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <img
            src={profileHolder}
            alt="Logo"
            className="h-8 w-8 rounded-full"
          />
          <h1 className="text-3xl font-bold tracking-tight text-black ml-2">
            Med <span className="text-red-600">Assist</span>
          </h1>
        </div>
        <div className="flex items-center ">
          <Link to="/doctor/Profile" className="mr-4">
            <FaUser className="text-4xl text-black hover:text-red-600" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Doctorhead;
