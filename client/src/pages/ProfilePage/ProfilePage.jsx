import React, { useContext } from "react";
import "./ProfilePage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";

function ProfilePage() {
  const navigate = useNavigate();
  const { logOutUser } = useContext(AuthContext);

  const handleDelete = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        const response = await axios.delete("/auth/delete", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        console.log(response.data.message);

        // Remove the JWT token from localStorage and update the logged-in status
        logOutUser();

        // Redirect to the home page after deletion
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Profile page</h1>
      <button onClick={handleDelete}>Delete Account</button>
    </div>
  );
}

export default ProfilePage;
