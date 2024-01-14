import React from 'react';
import Sidebar from '../AnonymousChat/Sidebar';
import Chat from '../AnonymousChat/Chat';
import { useUserChat } from '../../context/UserChatContext';
import { useUserAuth } from '../../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  const { data } = useUserChat();
  const { logOut } = useUserAuth();
  const navigate = useNavigate();
  console.log("Dashboard.jsx", data.user?.displayName)
  
  return (
    <div className='dashboard'>
      <div className='container'>
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  )
}

export default Dashboard;