import React from 'react'
import { IoVideocam } from "react-icons/io5";
import { IoIosCall } from "react-icons/io";
import { GiHamburgerMenu } from 'react-icons/gi';

const MessageAreaHead = ({setIsSidebarOpen , otherUser}) => {
  return (
    <div className=' sm:h-14 h-14
    '>
        <div className='flex items-center justify-between shadow-xl bg-gray-200 font-montserrat-regular fixed sm:w-3/4 w-full'>
        <button
          onClick={() => setIsSidebarOpen(prev => !prev)}
          className="sm:hidden p-3"
        >
          <GiHamburgerMenu size={24} />
        </button>
            <span className='p-3 font-bold truncate'>
             @{otherUser?.username || "username"}
            </span>
            <div className='flex sm:space-x-14 sm:pr-8 space-x-4 pr-5'>
                <IoVideocam size={28} className='text-black' />
                <IoIosCall size={28}  className='text-black'/>
            </div>
        </div>
    </div>
  )
}

export default MessageAreaHead ;