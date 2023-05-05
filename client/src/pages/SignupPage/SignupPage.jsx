import "../Styles.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Create an object representing the request body
    const requestBody = { email, password, name };

    // Or using a service
    authService
      .signup(requestBody)
      .then((response) => {
        // If the POST request is successful redirect to the login page
        navigate("/login");
      })
      .catch((error) => {
        // If the request resolves with an error, set the error message in the state
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="container">
      <div className="card mt-5">
        <div className="card-header">Sign Up</div>
        <div className="card-body">
          <form onSubmit={handleSignupSubmit}>
            <div className="input-group mb-3">
              <span className="input-group-text">Email:</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleEmail}
                className="form-control"
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text">Password:</span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handlePassword}
                className="form-control"
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text">Name:</span>
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleName}
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </form>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <p>Already have an account?</p>
          <Link to={"/login"}> Login</Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
