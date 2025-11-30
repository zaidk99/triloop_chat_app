import React, { useEffect, useRef, useState } from "react";
import { IoSendOutline } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { useDispatch } from "../../node_modules/react-redux/src/hooks/useDispatch";
import { setPaddingBottom } from "../redux/slices/messageAreaSlice";
import axiosInstance from "../utils/axiosInstance";

const MessageInput = ({ roomId, onSend }) => {
  const [text, setText] = useState("");

  const [suggestion, setSuggestion] = useState("");
  const [isFetchingSuggestion, setIsFetchingSuggestion] = useState(false);
  const textareaRef = useRef(null);
  const debounceRef = useRef(null);

  const submit = (e) => {
    e.preventDefault();
    onSend?.(text);
    setText("");
  };
  const textareaRef = useRef(null);
  const dispatch = useDispatch();

  // auto resize
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;

      const height = textarea.offsetHeight;
      if (height >= 150) {
        dispatch(setPaddingBottom(250));
      } else {
        dispatch(setPaddingBottom(height + 100));
      }
    }
  }, [text, dispatch]);

  // Debouce , and  calling backend

  useEffect(() => {
    if (!roomId) return;

    const trimmed = text.trim();
    if (trimmed === "") {
      setSuggestion("");
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setIsFetchingSuggestion(true);

        const res = await axiosInstance.get(`/messages/${roomId}/predict`, {
          params: { prefix: trimmed },
        });

        const first = res.data?.suggestions?.[0] || "";
        setSuggestion(first);
      } catch (err) {
        console.log("Prediction error:", err);
        setSuggestion("");
      } finally {
        setIsFetchingSuggestion(false);
      }
    }, 300);

    // clean up

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [text, roomId]);

  const handleSend = () => {
    if (text.trim()) {
      console.log("Send:", text);
      onSend?.(text);
      setText("");
    }
  };

  const ghostText = suggestion && suggestion.startsWith(text.trim()) ? suggestion : "";

  return (
    <form onSubmit={submit}>
      <div className="fixed bottom-0 sm:w-3/4 w-full px-4 py-2 bg-white border-t  border-gray-300 flex items-end gap-3 font-montserrat-regular  ">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message ..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 outline-none resize-none  overflow-y-auto"
          rows={1}
          style={{
            maxHeight: "150px",
          }}
        />
        <button onClick={handleSend} className="p-2">
          <IoSendOutline size={24} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
