import React, { use, useState } from "react";
import Navbar from "../components/Navbar";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [userLimit, setUserLimit] = useState("");
  const [descriptionLimit, setdescriptionLimit] = useState("");
  const [error, setError] = useState("");
  // const [privacy , setPrivacy] = useState("private");
  const options = ["Select Privacy Type", "Private", "Public"];
  const [selected, setSelected] = useState(options[0]);
  const [openPrivacyDropdown, setOpenPrivacyDropdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      setError("Room name is required.");
      return;
    }
    if (!userLimit || isNaN(userLimit) || userLimit < 2) {
      setError("Please enter a valid user limit (minimum 2).");
      return;
    }
    setError("");
    alert(`Room "${roomName}" created with limit ${userLimit}`);
    setRoomName("");
  };
  const chatroomdescriptionwordlimit = 50;
  const maxCharsPerword = 20;
  const [currentWordCharCount, setCurrentWordCharCount] = useState(0);

  const handledescriptionlimit = (e) => {
    let text = e.target.value;

    if (text.trim() === "") {
      setdescriptionLimit("");
      setCurrentWordCharCount(0);
      return;
    }

    let words = text.trim().split(/\s+/);
    if (words.length > chatroomdescriptionwordlimit) {
      words = words.slice(0, chatroomdescriptionwordlimit);
      text = words.join(" ");
    }
    const lastWord = words[words.length - 1];
    if (lastWord.length > maxCharsPerword) {
      words[words.length - 1] = lastWord.slice(0, maxCharsPerword);
      text = words.join(" ");
    }

    setdescriptionLimit(text);
    setCurrentWordCharCount(
      lastWord.length > maxCharsPerword ? maxCharsPerword : lastWord.length
    );
  };
  return (
    <>
      <div
        className="flex min-h-screen items-center justify-center font-montserrat-regular sm:px-2 px-9 "
        style={{
          backgroundColor: "#f0f4f8",
          backgroundImage: 'url("/doodles-bg.png")',
          backgroundRepeat: "repeat-x",
          backgroundPosition: "center",
          backgroundSize: "auto",
        }}
      >
        <div
          className="w-full max-w-full sm:max-w-md p-4 sm:p-8 rounded-2xl shadow-2xl border border-white/30 mb-36"
          style={{
            background: "rgba(255,255,255,0.50)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.45)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent ">
            Create Chat Room 
          </h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-5"
            style={{
              background: "transparent",
              borderRadius: "1rem",
              padding: "0",
              boxShadow: "none",
              border: "none",
            }}
          >
            <div>
              <label
                className="block mb-1 font-bold text-gray-700 text-sm sm:text-base"
                htmlFor="roomName"
              >
                Room Name
              </label>
              <input
                id="roomName"
                type="text"
                className="w-full border border-white/40 bg-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400 transition placeholder-gray-500 text-gray-800 text-sm sm:text-base"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                required
                style={{
                  background: "rgba(255,255,255,0.70)",
                  boxShadow: "0 1px 4px 0 rgba(31, 38, 135, 0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              />
            </div>
            <div>
              <label
                className="block mb-1 font-bold text-gray-700 text-sm sm:text-base"
                htmlFor="privacy"
              >
                Privacy
                <span
                  className="ml-2 text-gray-400 cursor-pointer"
                  title="If set to Public, the room will be visible to everyone. If set to Private, only invited users can see and join. User limit: min 2, max 5."
                >
                  &#9432;
                </span>
              </label>

              {/* <select
                id="privacy"
                className="w-full border border-white/40 bg-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400 transition text-gray-800 text-sm sm:text-base"
                value= {privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                required
                style={{
                  background: "rgba(255,255,255,0.70)",
                  boxShadow: "0 1px 4px 0 rgba(31, 38, 135, 0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select> */}

              <div className="relative inline-block w-full ">
                <div
                  onClick={() => setOpenPrivacyDropdown(!openPrivacyDropdown)}
                  className="border border-white/40 bg-white/20 px-3 py-2 cursor-pointer rounded  "
                  style={{
                    background: "rgba(255,255,255,0.70)",
                    boxShadow: "0 1px 4px 0 rgba(31, 38, 135, 0.08)",
                    // border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {selected}
                </div>
                {openPrivacyDropdown && (
                  <div className="absolute left-0 mt-1 w-full bg-white  rounded  ">
                    {options.map((option, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelected(option);
                          setOpenPrivacyDropdown(false);
                        }}
                        className="p-2 cursor-pointer border-2 border-transparent rounded  hover:bg-gray-100 hover:border-blue-500 "
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label
                className="block mb-1 font-bold text-gray-700 text-sm sm:text-base"
                htmlFor="userLimit"
              >
                User Limit
              </label>
              <input
                id="userLimit"
                type="number"
                min={2}
                className="w-full border border-white/40 bg-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400 transition placeholder-gray-500 text-gray-800 text-sm sm:text-base"
                value={userLimit}
                onChange={(e) => setUserLimit(e.target.value)}
                placeholder="Enter user limit (min 2)"
                required
                style={{
                  background: "rgba(255,255,255,0.70)",
                  boxShadow: "0 1px 4px 0 rgba(31, 38, 135, 0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              />
            </div>

            <div className={`${selected === options[2] ? "" : "hidden"} `}>
              <label
                className="block mb-1 font-bold text-gray-700 text-sm sm:text-base"
                htmlFor="forchatroomdecription"
              >
                Description or Rules
              </label>
              <textarea
                id="chatroomdescription"
                type="text"
                className="w-full border border-white/40 bg-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400 transition placeholder-gray-500 text-gray-800 text-sm sm:text-base"
                value={descriptionLimit}
                onChange={handledescriptionlimit}
                placeholder="Enter Description"
                style={{
                  background: "rgba(255,255,255,0.70)",
                  boxShadow: "0 1px 4px 0 rgba(31, 38, 135, 0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              />
              <p className="text-xs text-gray-600 mt-1">
                {descriptionLimit.trim().split(/\s+/).filter(Boolean).length} /{" "}
                {chatroomdescriptionwordlimit} words
              </p>
              <p className="text-xs text-gray-600">
                {currentWordCharCount} / {maxCharsPerword} characters (current
                word)
              </p>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold shadow-lg transition border-2 border-white text-sm sm:text-base cursor-pointer"
              style={{
                background: "rgba(37, 99, 235, 1)",
                border: "2px solid #fff",
                color: "#fff",
                boxShadow: "0 4px 16px 0 rgba(37, 99, 235, 0.25)",
              }}
            >
              Create Room
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRoom;
