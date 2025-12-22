import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSocket } from "../context/SocketContext";
import {
  friendRequestReceived,
  friendRequestAccepted,
  friendRequestRejected,
  friendRequestCancelled,
} from "../redux/slices/friendsSlice";

export const useFriendSocketListeners = () => {
  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleRequestReceived = (data) => {
      console.log("Friend request received in real-time:", data);
      dispatch(friendRequestReceived(data));
      
    };

    const handleRequestAccepted = (data) => {
      console.log("Friend request accepted in real-time:", data);
      dispatch(friendRequestAccepted(data));
      
    };

    const handleRequestRejected = (data) => {
      console.log("Friend request rejected in real-time:", data);
      dispatch(friendRequestRejected(data));
    };

    const handleRequestCancelled = (data) => {
      console.log("Friend request cancelled in real-time:", data);
      dispatch(friendRequestCancelled(data));
    };

    socket.on("friend:request-received", handleRequestReceived);
    socket.on("friend:request-accepted", handleRequestAccepted);
    socket.on("friend:request-rejected", handleRequestRejected);
    socket.on("friend:request-cancelled", handleRequestCancelled);

    return () => {
      socket.off("friend:request-received", handleRequestReceived);
      socket.off("friend:request-accepted", handleRequestAccepted);
      socket.off("friend:request-rejected", handleRequestRejected);
      socket.off("friend:request-cancelled", handleRequestCancelled);
    };
  }, [socket, dispatch]);
};
