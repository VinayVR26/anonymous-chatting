import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import App from './App';
import { UserAuthContextProvider } from "./context/UserAuthContext";
import { UserChatContextProvider } from './context/UserChatContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <BrowserRouter>
      <UserAuthContextProvider>
        <UserChatContextProvider>
          <App />
        </UserChatContextProvider>
      </UserAuthContextProvider>
  </BrowserRouter>
);

