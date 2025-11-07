import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  respondRequest,
  selectIncoming,
  fetchFriends,
  fetchRequests,
} from "../redux/slices/friendsSlice.jsx";


const IncomingFriendlist = () => {
  const dispatch = useDispatch();
  const incoming = useSelector(selectIncoming);

  const onAccept = async (id) => {
    await dispatch(respondRequest({ requestId: id, action: "accept" }));
    await Promise.all([dispatch(fetchFriends()), dispatch(fetchRequests())]);
  };

  const onReject = async (id) => {
    await dispatch(respondRequest({ requestId: id, action: "reject" }));
    await dispatch(fetchRequests());
  };
  return (
    <div className="border-2 border-gray-400 shadow-2xl rounded-lg p-4 overflow-y-auto overscroll-contain max-h-[40vh] sm:max-h-[60vh] ">
      {incoming.length === 0 && <div className="text-sm text-gray-500">No Incoming Requests</div>}
      {incoming.map((req) => (
        <div key={req.id} className="flex justify-between p-2 border-b">
          <span>@{req.from?.username || "unknown"}</span>
          <div className="flex gap-2">
            <button onClick={()=>onAccept(req.id)} className="text-green-600 cursor-pointer">Accept</button>
            <button onClick={()=> onReject(req.id)} className="text-red-500 cursor-pointer">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IncomingFriendlist;
