import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";

const ProtectedRoute = ({ children }) => {

  const { user } = useUserAuth(); 
  console.log('userinprotected', Object.keys(user).length)

  if (Object.keys(user).length == 0) {
    console.log("Why navigate?", user)
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute; 
