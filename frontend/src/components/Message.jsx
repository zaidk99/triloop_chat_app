import React from 'react'
import MessageAreaHead from './MessageAreaHead'
import MessageArea from './MessageArea'
import MessageInput from './MessageInput'

const Message = ({setIsSidebarOpen , messages , onSend , otherUser}) => {
  return (
    <div className='sm:w-3/4 w-full h-screen  overflow-hidden flex flex-col'>
        <MessageAreaHead setIsSidebarOpen={setIsSidebarOpen} otherUser={otherUser}/>
        <MessageArea messages={messages} />
        <MessageInput onSend={onSend} />
    </div>
  )
}

export default Message;