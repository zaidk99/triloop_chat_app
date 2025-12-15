import React, { useEffect, useRef, useState } from "react";
import { IoSendOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { setPaddingBottom } from "../redux/slices/messageAreaSlice";
import axiosInstance from "../utils/axiosInstance";

const MessageInput = ({ roomId, onSend }) => {
  const [text, setText] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [allSuggestions, setAllSuggestions] = useState([]);

  const [isFetchingSuggestion, setIsFetchingSuggestion] = useState(false);

  const textareaRef = useRef(null);
  const debounceRef = useRef(null);
  const textWidthRef = useRef(null);

 const [textWidth , setTextWidth] = useState(0);

  const dispatch = useDispatch();

  const submit = (e) => {
    e.preventDefault();
    onSend?.(text);
    setText("");
  };



  // Auto-resize textarea
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


  // text width for ghost positioning
  useEffect(()=>{
    if(textareaRef.current && text){
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const computedStyle = window.getComputedStyle(textareaRef.current);
      context.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
      const width = context.measureText(text).width;
      setTextWidth(width);
    }else{
      setTextWidth(0);
    }
  },[text]);

  // Fetch prediction with debounce
  useEffect(() => {
    if (!roomId) return;

    const trimmed = text.trim();
    if (trimmed === "") {
      setSuggestion("");
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setIsFetchingSuggestion(true);

        console.log("Prediction triggered with:", trimmed);

        const res = await axiosInstance.get(`/messages/${roomId}/predict`, {
          params: { prefix: trimmed },
        });

        console.log("Suggestion from backend : ", res.data);

        const suggestions = res.data?.suggestions || [];
        const first = res.data?.suggestions?.[0]?.word || "";
        setSuggestion(first);
        setAllSuggestions(suggestions);
      } catch (err) {
        console.log("Prediction error:", err);
        setSuggestion("");
      } finally {
        setIsFetchingSuggestion(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [text, roomId]);

  const handleSend = () => {
    if (text.trim()) {
      onSend?.(text);
      setText("");
    }
  };

  const showGhost = suggestion && text.trim().length > 0;

  const remainder = suggestion ? `${suggestion}` : "";
  return (
    <form onSubmit={submit}>
      <div className="fixed bottom-0 sm:w-3/4 w-full px-4 py-2 bg-white border-t border-gray-300 flex items-end gap-3 font-montserrat-regular">
        {/* Wrapper for ghost + textarea */}
        <div className="relative w-full flex-1">
          {/* Ghost text (behind textarea) */}
          {showGhost && (
            <div
              className="absolute top-0 left-0 pointer-events-none text-gray-400 px-3 py-2 whitespace-pre-wrap"
              style={{
                fontSize: "16px",
                lineHeight: "20px",
                zIndex: 0, // behind textarea
                paddingLeft: `${textWidth + 12}px`,
              }}
            >
             <span className="text-gray-400">{" " + remainder}</span>
            </div>
          )}

          {/* Actual textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message ..."
            onKeyDown={(e) => {
              if (e.key === "Tab" && suggestion) {
                e.preventDefault();
                setText((prev) => prev.trim() + " " + suggestion);
                setSuggestion("");
                setAllSuggestions([]);
              }
            }}
            className="border border-gray-300 rounded px-3 py-2 outline-none resize-none overflow-y-auto w-full bg-transparent"
            rows={1}
            style={{
              maxHeight: "150px",
              position: "relative",
              zIndex: 1, // above ghost text
            }}
          />
        </div>

        <button onClick={handleSend} className="p-2">
          <IoSendOutline size={24} />
        </button>
      </div>

      {/* Suggestion options */}
      {allSuggestions.length > 0 && (
        <div
        className="fixed bottom-16 sm:bottom-16 left-0 sm:left-1/4 right-0 sm:right-0 px-4 py-2 bg-white border-t border-gray-200 flex gap-2 flex-wrap"> 
          {allSuggestions.map((allsugop,index)=>(
            <button
              key={index}
              type="button"
              onClick={() => {
              setText((prev) => prev.trim() + " " + allsugop.word);
              setSuggestion("");
              setAllSuggestions([]);
            }}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition"
            >
              {allsugop.word}
            </button>
      ))}
        </div>
      )}
    </form>
  );
};

export default MessageInput;
