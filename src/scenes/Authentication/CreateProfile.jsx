import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useUserAuth } from "../../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";


const CreateProfile = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isUsernameUsed, setIsUsernameUsed] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);


  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
  };

  useEffect(() => {
    const checkUsername = async () => {
      const usernameDocRef = doc(db, "usernames", "usernameList");
      const usernameDoc = await getDoc(usernameDocRef);

      if (usernameDoc.exists()) {
        const usernameList = usernameDoc.data().usernames;
        const isUsed = usernameList.includes(username);
        setIsUsernameUsed(isUsed);
      }
    };

    const timeoutId = setTimeout(() => {
      if (username.trim() !== "") {
        checkUsername();
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [username]);


  const handleCreateProfile = async (e) => {
    e.preventDefault();
    try {
      setError("");
      if (isUsernameUsed) {
        return;
      }

      const userEmail = user.email;
      const userDocRef = doc(db, "users", username);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) { //new sign-ins, email added
        await setDoc(userDocRef, {
          email: userEmail,
        });
      }
      //const userDocRef = doc(db, "users", username);
      await updateDoc(userDocRef, {
        displayName: username,
        uid: user.uid
      });

      const usernameListDocRef = doc(db, "usernames", "usernameList");
      const usernameListDoc = await getDoc(usernameListDocRef);

      if (usernameListDoc.exists()) {
        const currentUsernameList = usernameListDoc.data().usernames;
  
        if (!currentUsernameList.includes(username)) {
          const updatedUsernameList = [...currentUsernameList, username];
          await updateDoc(usernameListDocRef, {
            usernames: updatedUsernameList,
          });
        }
      }

      let photoURL = null;
      // Upload avatar to Firebase Storage
      if (avatarFile) {
        //const date = new Date().toISOString();
        const storageRef = ref(storage, `${username}`);
        const uploadTask = uploadBytesResumable(storageRef, avatarFile);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // You can track the upload progress if needed
            },
            (error) => {
              console.error("Error uploading avatar:", error);
              reject(error);
            },
            async () => {
              // Avatar uploaded successfully, get download URL
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

              photoURL = downloadURL;
  
              // Update Firestore with the downloadURL
              await updateDoc(userDocRef, {
                photoURL: downloadURL,
              });
  
              resolve();
            }
          );
        });
      }

      await updateProfile(user, {
        displayName: username,
        photoURL: photoURL,
      });

      await setDoc(doc(db, "userChats", username), {});
      
      navigate("/dashboard");
    } catch (err) {
      console.log(err)
      setError("An error occurred while creating the profile");
    }
  };

  return (
    <>
    <div className="authentication-body">
      <div className="p-4 box">
        <h3>Create a username to remain anonymous</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleCreateProfile}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {isUsernameUsed && (
              <Alert variant="danger" className="small-padding"><div className="username-in-use">Username is in use</div></Alert>
            )}
          </Form.Group>

          <label htmlFor="file" className="avatar-label">
              <div className="avatar-box">
                {avatarFile ? (
                  <img
                    src={URL.createObjectURL(avatarFile)}
                    alt="Selected Avatar"
                  />
                ) : (
                  <div className="text-container">Profile image
                  </div>
                )}
              </div>
              <br></br>
            </label>

            <input
              type="file"
              id="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />

          <div className="d-grid gap-2">
            <Button className="o-btn" variant="primary" type="submit">
              Create Username
            </Button>
          </div>
        </Form>
      </div>
      </div>
    </>
  );
};

export default CreateProfile;
