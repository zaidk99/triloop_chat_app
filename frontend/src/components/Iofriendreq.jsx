import React from "react";
import IncomingFriendlist from "./IncomingFriendlist";
import OutgoingFriendlist from "./OutgoingFriendlist";

const Iofriendreq = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <h2 className="text-lg font-bold mb-2">Incoming requests</h2>
        <IncomingFriendlist />
      </div>
      <div>
      <h2 className="text-lg font-bold mb-2">Outgoing requests</h2>
        <OutgoingFriendlist />
      </div>
    </div>
  );
};

export default Iofriendreq;
