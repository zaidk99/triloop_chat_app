import React, { useEffect } from "react";
import PrivateMessagecards from "../components/PrivateMessagecards";
import {useDispatch , useSelector} from "react-redux";
import {fetchFriends , selectFriends} from  "../redux/slices/friendsSlice";

const PrivateChats = () => {
  const dispatch = useDispatch();
  const friends = useSelector(selectFriends);

  useEffect(() => {
    if(friends.length === 0) dispatch(fetchFriends());
  },[dispatch , friends.length]);


  return (
    <div className="px-5 max-h-[85vh] overflow-auto font-montserrat-regular mt-3">
      <div className="sticky top-0 z-10 bg-white py-2 ">
        <h2 className="text-4xl font-medium bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent inline-block p-2 ">
          Friends
        </h2>
      </div>

      <div className="pt-7 grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5 ">
        {friends.map((u)=>(
          <div key={u._id} className="bg-white shadow-md rounded-lg p-4 text-center hover:bg-gray-300 transition-shadow duration-200">
          <div className="font-medium text-lg">{u.fullName}</div>
          <div className="text-sm text-gray-500">@{u.username}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivateChats;
