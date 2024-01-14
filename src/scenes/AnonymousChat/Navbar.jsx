import React from 'react';
import { useUserAuth } from '../../context/UserAuthContext';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = useUserAuth();
  const { logOut } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <div className='navbar'>
      <span className='logo'>Helpify</span>
      <div className='user'>
        <img src={user.photoURL} alt=''/>
        <span>{user.displayName}</span>
        <button onClick={handleLogout}>logout</button>


      </div>


    </div>
  )
}

export default Navbar