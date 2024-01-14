import React, { useState } from "react";
//import style from "../../style.css";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../../context/UserAuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { db, auth } from "../../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { logIn, googleSignIn, user } = useUserAuth();
  const navigate = useNavigate();

  console.log('currentUserSeeing', user)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await logIn(email, password);
      //console.log('check', 0 == '0'); // true

      const userInfo = userCredential.user;
      //console.log('usercred', userCredential.user === user); // false

      //console.log('userverifylogin', user.emailVerified);
      console.log('userverifylogin', user.displayName == null);
      
      
      //const userDocRef = doc(db, "users", email);
      console.log("Email added here");
      //const userDocSnap = await getDoc(userDocRef);

      if (userInfo.emailVerified && userInfo.displayName != null) {
        navigate("/dashboard");

      } else if (userInfo.emailVerified && userInfo.displayName == null) {
        navigate("/create-profile");

      } else {
        navigate("/verify-email-message");

      }
    } catch (err) {
      setError(err.message);
      console.log("REACHEDHERE");
    }
  };
  
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      const currentUser = auth.currentUser;
      const userDocRef = doc(db, "users", currentUser.email);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        navigate("/create-profile");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }

  return (
    <>
    <div className="authentication-body">
      <div className="p-4 box">
        <h2 className="mb-3">Seek Help</h2>
        {/* Display any error message */}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Email address"
              // Update the email state when the input value changes
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <div className="input-group">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                // Update the password state when the input value changes
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-link"
                onClick={handlePasswordToggle}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </Form.Group>

          {/* Submit button to log in using email/password */}
          <div className="d-grid gap-2">
            <Button className="o-btn" variant="primary" type="Submit">
              Log In
            </Button>
          </div>
        </Form>
          <div className="p-4 box mt-3 text-center">
            Don't have an account? <Link to="/signup" className="clickableText">Sign up</Link>
          </div>
          <div className="p-4 box mt-3 text-center">
            Forgot your password? <Link to="/reset-password" className="clickableText">Reset password</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;