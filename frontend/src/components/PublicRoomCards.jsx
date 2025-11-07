import React from "react";

const PublicRoomCards = (props) => {
  return (
    <div>
      <div className="border-2 border-gray-300 p-3 rounded-2xl font-montserrat-regular cursor-pointer grid gap-2 hover:bg-gray-100">
        <h1 className="font-bold  truncate text-blue-400">{props.name}</h1>
         <span><span className="font-medium"> members : </span>{props.members}</span>
        <div>
          <span className="font-medium">online : </span>
          <span className="text-green-700">{props.status}</span>
        </div>
        <div>
          <p>{props.description}</p>
        </div>
      </div>
    </div>
  );
};

export default PublicRoomCards;
