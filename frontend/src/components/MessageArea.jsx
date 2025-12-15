import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const MessageArea = ({ messages }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const bottomPadding = useSelector((state) => state.messageArea.paddingBottom);
  const me = JSON.parse(localStorage.getItem("user"));
  const myId = me?.id || me?._id;

  return (
    <div
      className="h-full w-full px-4 py-4 space-y-4 overflow-y-auto bg-gray-100 bg-fixed bg-center bg-repeat font-montserrat-regular"
      style={{
        backgroundImage: "url('/chat-bg.png')",
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
        paddingTop: "5rem",
        paddingBottom: `${bottomPadding}px`,
      }}
    >
      {messages.map((msg) => {
        // normalize shape
        const isMe =
          msg.sender === "me" ||
          String(msg.sender) === String(myId) ||
          String(msg.sender?._id) === String(myId);

        return (
          <div
            key={msg._id || msg.id || `${msg.time}_${msg.content}`}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg text-white break-words whitespace-pre-wrap sm:text-lg text-sm ${
                isMe ? "bg-blue-500" : "bg-gray-700"
              }`}
            >
              {msg.content}
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
};

export default MessageArea;