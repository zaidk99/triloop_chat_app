import React from "react";
import ListHead from "./ListHead";
import RecentChatList from "./RecentChatList";

const ChatMainSidebar = ({isSidebarOpen , setIsSidebarOpen}) => {
  return (
    <div className={`absolute sm:relative sm:block sm:w-1/4 h-screen  overflow-hidden   font-montserrat-regular z-50 ${isSidebarOpen ? "block w-2/3" : "hidden"}`} >
      <ListHead setIsSidebarOpen={setIsSidebarOpen}/>
      <div className="sm:mt-28  overflow-y-auto ">
        <RecentChatList />
      </div>
    </div>
  );
};

export default ChatMainSidebar;


