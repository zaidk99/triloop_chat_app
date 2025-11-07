import React from 'react'
import { TbMessageCircleShare } from "react-icons/tb";


const PrivateMessagecards = (props) => {
  return (
    <div>
        <div className='border-2 border-gray-300 p-3 rounded-2xl font-montserrat-regular cursor-pointer hover:bg-teal-200'>
            <h2 className='font-bold text-black truncate'>{props.username}</h2>
            <span className='font-medium text-blue-400 break-words'>{props.status}</span>
        </div>
    </div>
  );
}

export default PrivateMessagecards