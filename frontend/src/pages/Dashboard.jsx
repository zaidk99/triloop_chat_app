import React from "react";
import { PiScribbleLoopThin } from "react-icons/pi";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Iofriendreq from "../components/iofriendreq";
import { useSocket } from '../context/SocketContext';
import { useSelector } from "react-redux";
import { useEffect } from "react";


const Dashboard = () => {

  return (
    <>
      <div className="flex flex-col font-montserrat-regular relative bg-white h-dvh overflow-y-auto ">
        <div className="px-7 sm:px-0">
          <div className="hidden sm:flex flex-col sm:flex-row items-stretch  rounded-2xl sm:rounded-full shadow-xl px-2 py-1 sm:px-4 sm:py-2 md:py-3 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto mt-4 border-gray-300 border-2 ">
            <Link
              to="/privatechats"
              className="flex-1 h-full cursor-pointer hover:bg-gray-100 sm:rounded-l-full transition text-center py-2 flex flex-col w-full justify-center items-center"
            >
              <div className="font-semibold text-sm">Message Contacts</div>
              <div className="text-gray-500 text-xs">Chat privately</div>
            </Link>
            <div className="w-px h-8 bg-gray-200 mx-4 hidden sm:block self-center"></div>
            <Link
              to="/createrooms"
              className="flex-1 cursor-pointer hover:bg-gray-100  transition py-2 w-full flex flex-col justify-center items-center text-center "
            >
              <div className="font-semibold text-sm">Create Chat Room</div>
              <div className="text-gray-500 text-xs">Start a new group</div>
            </Link>
            <div className="w-px h-8 bg-gray-200 mx-4 hidden sm:block self-center"></div>
            <Link
              to="/publicchatrooms"
              className="flex-1 cursor-pointer hover:bg-gray-100 rounded-r-full transition  py-2 w-full flex flex-col justify-center items-center text-center"
            >
              <div className="font-semibold text-sm">Community Chat</div>
              <div className="text-gray-500 text-xs">Join public rooms</div>
            </Link>
          </div>
        </div>
        <div className="p-10">
          <h1 className="text-2xl font-bold mb-4">Friend Requests</h1>
          <Iofriendreq />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
