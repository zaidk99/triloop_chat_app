import React from "react";
import { CiSearch } from "react-icons/ci";
import { GiHamburgerMenu } from "react-icons/gi";

const ListHead = ({setIsSidebarOpen}) => {
  return (
    <div className= {`bg-gray-200 sm:w-1/4 p-2 pt-0 fixed  shadow-xl z-50 sm:h-28 block w-2/3 `} >
    <div className="flex items-center justify-between ">
      <span className="font-bold text-2xl">Chats</span>
      <button
          onClick={() => setIsSidebarOpen(prev => !prev)}
          className="sm:hidden block p-3"
        >
          <GiHamburgerMenu size={24} />
      </button>
    </div>
      <div className="flex bg-white items-center px-3 py-1 rounded mt-2 sm:mt-5">
        <input
          type="search"
          name="searchrecentchatslist"
          id="searchrecentchatsfromlist"
          className="outline-none w-full"
          placeholder="Search Chats ..."
        />
        <CiSearch size={20} />
      </div>
    </div>
  );
};

export default ListHead;
