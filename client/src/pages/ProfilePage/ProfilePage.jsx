import React, { useState, useContext, useEffect } from "react";
import '../Styles.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logOutUser } = useContext(AuthContext);
  const [diagnosis, setDiagnosis, setUser] = useState("");
  // const [setUser] = useState({});

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

  const handleGenerateDiagnosis = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        const response = await axios.post("/diagnosis/diagnosis", {}, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setDiagnosis(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async (e) => {
    // e.preventDefault();
    // try {
    //   const formData = new FormData();
    //   formData.append("profilePic", e.target.profilePic.files[0]);
    //   const authToken = localStorage.getItem("authToken");
    //   const response = await axios.post("/auth/uploadProfilePic", formData, {
    //     headers: { Authorization: `Bearer ${authToken}` },
    //   });
    //   console.log(response.data.message);
    //   setUser(prevUser => ({ ...prevUser, profilePic: response.data.profilePic }));
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const handleFileChange = (e) => {
    setUser(prevUser => ({ ...prevUser, profilePic: URL.createObjectURL(e.target.files[0]) }));
  };

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
          const response = await axios.get("/chat/messages", {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          setUser(response.data.user);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [setUser]);

  return (
    <div>
      <h1>My bio</h1>
      <div className="row justify-content-center">
        {/* <div className="col-xl-4">
          <div className="card mb-4 mb-xl-0">
            <div className="card-header">Profile Picture</div>
            <div className="card-body text-center">
              <img
                className="img-account-profile rounded-circle mb-2"
                src={user.profilePic}
                alt=""
              />
              <div className="small font-italic text-muted mb-4">
                JPG or PNG no larger than 5 MB
              </div>
              <form
                className="d-flex flex-column justify-content-center"
                onSubmit={handleUpload}
              >
                <input
                  className="form-control"
                  type="file"
                  name="profilePic"
                  onChange={handleFileChange}
                />
                <button className="btn btn-light" type="submit">
                  Upload new image
                </button>
              </form>
              {diagnosis === "" && (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>
          </div>
        </div> */}
      <div className="col-xl-8">
        <div className="card mb-4">
          <div className="accountDetail text-white fw-bold d-flex ps-4 pe-4 justify-content-between align-items-center">
            <div className="mt-3">
              <p>Account Details</p>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-light"
                onClick={() => navigate("/editProfile")}
              >
                Edit
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="row gx-3 mb-3">
              <div className="col-md-6">
                <label className="small mb-1" htmlFor="inputFirstName">
                  Name
                </label>
                <h5 className="lead">{user.name}</h5>
              </div>
              {/* <div className="col-md-6">
                <label className="small mb-1" htmlFor="inputLastName">
                  Last name
                </label>
                <h5 className="lead">{user.lastName}</h5>
              </div> */}
            </div>
            <div className="row gx-3 mb-3">
              <div className="col-md-6 mb-3">
                <label className="small mb-1" htmlFor="inputEmailAddress">
                  Email address
                </label>
                <h5 className="lead">{user.email}</h5>
              </div>
              <div className="col-md-6 mb-3">
                <label className="small mb-1" htmlFor="inputPassword">
                  Password
                </label>
                <h5 className="lead">***********</h5>
              </div>
            </div>
            <div className="row gx-3 mb-3">
              <div>
                <p>{user.diagnosis}</p>
              </div>
            </div>
          </div>
          <div>
            <button
              className="btn btn-light"
              type="button"
              onClick={handleGenerateDiagnosis}
            >
              Generate Diagnosis
            </button>
            {diagnosis && (
              <div>
                <h2>Therapist Notes</h2>
                <p>{diagnosis}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <button onClick={handleDelete}>Delete Account</button>
</div>
);
}

export default ProfilePage;
