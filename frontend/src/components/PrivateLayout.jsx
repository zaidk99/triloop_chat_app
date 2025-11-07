import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchFriends , fetchRequests } from "../redux/slices/friendsSlice";


export default function PrivateLayout() {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(fetchFriends());
    dispatch(fetchRequests());
  },[dispatch]);

  return (
    <>
      <Navbar />
      <div className="pt-16 min-h-[calc(100vh-100px)]"> 
        <Outlet />
      </div>
    </>
  );
}