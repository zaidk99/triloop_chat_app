import React, { useEffect, useRef, useState } from "react";
import { PiScribbleLoopThin } from "react-icons/pi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch } from "react-redux";
import { FiSend } from "react-icons/fi";
import { FaUserFriends } from "react-icons/fa";
import {
  searchUsers,
  sendRequest,
  fetchRequests,
} from "../redux/slices/friendsSlice";
import axios from "axios";

const Navbar = () => {
  const username =
    JSON.parse(localStorage.getItem("user"))?.username || "Guest";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isMdUp, setIsMdup] = useState(window.innerWidth >= 768);
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);

  const menuRef = useRef();
  const buttonRef = useRef();

  // Resize handler
  useEffect(() => {
    const handler = () => setIsMdup(window.innerWidth >= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const id = setTimeout(async () => {
      if (q.trim().length < 2) {
        setResults([]);
        return;
      }
      const { meta, payload } = await dispatch(searchUsers(q));
      if (!meta.rejected) setResults(payload);
    }, 300);

    return () => clearTimeout(id);
  }, [q, dispatch]);

  const onSend = async (userId) => {
    await dispatch(sendRequest(userId));
    await dispatch(fetchRequests());
    setResults([]); // Clear search after sending request
    setQ(""); // Clear search input
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const shouldShowCapsuleLinksInDropdown =
    isMdUp && location.pathname !== "/dashboard";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white text-black font-montserrat-regular flex items-center justify-between px-4 py-3 sm:px-8 z-[60]">
      {/* Logo */}
      <div className="flex shrink-0 mr-4">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold">
          <PiScribbleLoopThin className="w-10 h-10" />
          <span className="text-lg sm:text-xl font-semibold sm:block hidden">
            triloop
          </span>
        </Link>
      </div>

      {/* Search */}
      <div className="flex flex-1 justify-center relative px-4 ">
        <div className="relative w-full max-w-[900px] ">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onBlur={() => setTimeout(()=> setResults([]) , 150 )}
            placeholder="Search users..."
            className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm focus:shadow-md"
          />
          {results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow max-h-80 overflow-y-auto z-[60]">
              {results.map((u) => {
                const relation = u.relation;
                return (
                  <div
                    key={u._id}
                    className="flex items-center justify-between px-3 py-2 border-b hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium">{u.fullName}</div>
                      <div className="text-xs text-gray-500">@{u.username}</div>
                    </div>
                    <div>
                      
                        <button
                          onClick={() => navigate(`/chat/${u._id}`)}
                          className="p-2 rounded hover:bg-gray-100"
                          title="Message"
                        >
                          <FiSend className="text-gray-700" />
                        </button>
                     
                      {relation === "none" && (
                        <button
                          onClick={() => onSend(u._id)}
                          className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800"
                        >
                          <FaUserFriends />
                        </button>
                      )}
                      {relation === "pending_outgoing" && (
                        <button
                          disabled
                          className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded"
                        >
                          Pending
                        </button>
                      )}
                      {relation === "pending_incoming" && (
                        <Link
                          to="/dashboard"
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          onClick={() => setResults([])}
                        >
                          Respond
                        </Link>
                      )}
                      {relation === "friend" && (
                        <button
                          disabled
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded"
                        >
                          Friend
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <span className="text-sm sm:text-base font-medium hidden sm:block">
          Hey, {username}, Welcome
        </span>

        <button
          className="text-2xl sm:text-3xl ml-4 sm:ml-4 cursor-pointer"
          ref={buttonRef}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <GiHamburgerMenu />
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-3 top-14 bg-white rounded-2xl p-3 w-48 sm:w-52 sm:text-sm text-xs z-[60] space-y-2 cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.65)] transition-transform duration-200 ease-in-out scale-95 origin-top-right"
          >
            <div className="space-y-2">
              <div className="hover:bg-gray-100 p-2 rounded-lg">
                <Link
                  to="/dashboard"
                  className="block hover:text-blue-500"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </div>
              {(!isMdUp || shouldShowCapsuleLinksInDropdown) && (
                <div className="space-y-1">
                  <div className="hover:bg-gray-100 rounded-lg p-2">
                    <Link
                      to="/privatechats"
                      className="block hover:text-blue-500"
                      onClick={() => setMenuOpen(false)}
                    >
                      Messages
                    </Link>
                  </div>
                  <div className="hover:bg-gray-100 rounded-lg p-2">
                    <Link
                      to="/createrooms"
                      className="block hover:text-blue-500"
                      onClick={() => setMenuOpen(false)}
                    >
                      Create Room
                    </Link>
                  </div>
                  <div className="hover:bg-gray-100 rounded-lg p-2">
                    <Link
                      to="/publicchatrooms"
                      className="block hover:text-blue-500"
                      onClick={() => setMenuOpen(false)}
                    >
                      Public Rooms
                    </Link>
                  </div>
                </div>
              )}
              <div className="hover:bg-gray-100 rounded-lg p-2">
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-left w-full text-red-500 hover:text-red-600 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
