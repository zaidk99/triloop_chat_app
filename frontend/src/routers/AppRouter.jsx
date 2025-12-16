import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import CreateRoom from "../pages/CreateRoom.jsx";

import PublicRoutes from "../pages/PublicRoutes.jsx";    
import PrivateRoutes from "../pages/PrivateRoutes.jsx";

import PublicLayout from "../components/PublicLayout.jsx";
import PrivateLayout from "../components/PrivateLayout.jsx";
import Chat from "../components/Chat.jsx";
import PrivateChats from "../pages/PrivateChats.jsx";
import PublicRooms from "../pages/PublicRooms.jsx";

export default function AppRouter() {

  
  return (
    <BrowserRouter>
      <Routes>
 
        <Route element={<PublicRoutes />}>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Route>

     
        <Route element={<PrivateRoutes />}>
          <Route element={<PrivateLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/privatechats" element={<PrivateChats />} />
            <Route path="/createrooms" element={<CreateRoom />} />
            <Route path="/chat/:userId" element={<Chat />}/>
            <Route path="/publicchatrooms" element={<PublicRooms />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

