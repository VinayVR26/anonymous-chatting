import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route, useLocation, BrowserRouter } from "react-router-dom";
import './style.scss';
import Login from "./scenes/Authentication/Login";
import Signup from "./scenes/Authentication/Signup";
import ProtectedRoute from "./scenes/Authentication/ProtectedRoute";
import PasswordReset from "./scenes/Authentication/PasswordReset";
import VerifyEmail from "./scenes/Authentication/VerifyEmail";
import CreateProfile from "./scenes/Authentication/CreateProfile";
import Dashboard from "./scenes/Dashboard/Dashboard";
//import Home from "./scenes/Authentication/Home";
import { UserAuthContextProvider } from "./context/UserAuthContext";

function App() {
  return (
    <>
      <Container style={{ width: "400px" }}>
        <Row>
          <Col>
              <Routes>
                <Route path="/" element={<Login/>}/> {/*index element*/}
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/reset-password" element={<PasswordReset/>}/>
                <Route path="/verify-email-message" element={<VerifyEmail/>}/>
                <Route path="/create-profile" element={<CreateProfile/>}/>
              </Routes>
          </Col>
        </Row>
      </Container>
    
        <Routes>
          <Route path="/dashboard"
              index element = { // or index element
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          />


        </Routes>
        
      
      
    </>
  );
}

export default App;
