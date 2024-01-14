import { Link } from "react-router-dom";
//import "../../style.css";

const VerifyEmailMessage = () => {

  return (
    <>
    <div className="authentication-body">
      <div className="p-4 box">
        <h2>Email Verification Required</h2>
        <p>Please check your email and verify your account to access the content.</p>

        Return to Log In <Link to="/">Log In</Link>
      </div>
      
      </div>
    </>
  );

};

export default VerifyEmailMessage;