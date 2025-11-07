import React from 'react'
import { useDispatch , useSelector } from 'react-redux';
import {cancelRequest, selectOutgoing , fetchRequests}  from '../redux/slices/friendsSlice.jsx';


const OutgoingFriendlist = () => {

  const dispatch = useDispatch();
  const outgoing = useSelector(selectOutgoing);

  const onwithDraw = async (id) => {
    await dispatch(cancelRequest(id));
    await dispatch(fetchRequests());
  };



  return (
    
    <div className='border-2 border-gray-400 shadow-2xl rounded-lg p-4 overflow-y-auto overscroll-contain max-h-[40vh] sm:max-h-[60vh]'>
     {/* {outgoingRequests.map((req)=>(
        <div
        key={req.username}
        className='flex justify-between items-center p-2 border-b'
        >
         <span className='font-semibold '>{req.username}</span>
            <div className='flex gap-2'>
                <button className='text-blue-600 cursor-pointer'>{req.action}</button>
            </div>
        </div>
     ))} */}

     {outgoing.length === 0 && <div className="text-sm text-gray-500">No Outgoing requests</div>}
     {outgoing.map((req)=>(
      <div key={req.id} className="flex justify-between items-center p-2 border-b">
        <span>@{req.to?.username || "unknown" }</span>
        <div className='flex gap-2'>
          <button onClick={()=> onwithDraw(req.id)} className='text-blue-600 cursor-pointer'>withdraw</button>
        </div>
      </div>
     ))}
     </div>
  );
};

export default OutgoingFriendlist