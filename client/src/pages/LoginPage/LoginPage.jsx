import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import authService from "../../services/auth.service";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();
  const { isAuthenticated, storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };
    
    authService
    .login(requestBody)
    .then((response) => {
      storeToken(response.data.authToken);
      authenticateUser();
      navigate("/chat"); // Redirect to "/chat" after successful login
    })
    .catch((error) => {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat"); // Redirect to "/chat" if user is already authenticated
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container">
      <div className="card mt-5">
        <div className="card-header">Login</div>
        <div className="card-body">
          <form onSubmit={handleLoginSubmit}>
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

            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <p>Don't have an account yet?</p>
          <Link to={"/signup"}> Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
