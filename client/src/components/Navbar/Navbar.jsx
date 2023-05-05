import '../../pages/Styles.css';
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOutUser();
    navigate("/");
  };

  const location = useLocation(); // Get the current location

  return (
    <header className="d-flex flex-row justify-content-between ps-4 pe-4 pt-2">
      <Link to="/" className="header-sides logo m-0 d-flex align-items-center gap-2 bg-transparent rounded p-1">
        {/* Add your SVG or logo here */}
        <div className="header fw-bold fs-3">TherapyAi</div>
      </Link>
      {isLoggedIn ? (
        <>
          {location.pathname !== "/chat" && (
            <div className="m-0">
              <Link to="/chat">
                <button type="button" className="header btn fs-4 bg-transparent m-0">
                  Chat
                </button>
              </Link>
            </div>
          )}
          <div className="header-sides m-0">
            <Link to="/profile" className="header btn fs-4 bg-transparent m-0" as="button">
              <span className="header fw-bold fs-4">{user && user.name}</span>
            </Link>
          </div>
          <div className="header-sides m-0">
            <button onClick={handleLogout} className="header btn fs-4 bg-transparent m-0">
              Logout
            </button>
          </div>
        </>
      ) : (
        <>
          {window.location.pathname === "/signup" ? (
            <div className="header-sides m-0 d-flex justify-content-center">
              <Link className="header btn fs-4 bg-transparent m-0" to="/login">
                Login
              </Link>
            </div>
          ) : window.location.pathname === "/" ? (
            <>
              <div className="m-0">
                <Link className="header btn fs-4 bg-transparent m-0" to="/signup">
                  Sign Up
                </Link>
              </div>
              <div className="header-sides m-0 d-flex justify-content-center">
                <Link className="header btn fs-4 bg-transparent m-0" to="/login">
                  Login
                </Link>
              </div>
            </>
          ) : (
            <div className="m-0">
              <Link className="header btn fs-4 bg-transparent m-0" to="/signup">
                Sign Up
              </Link>
            </div>
          )}
        </>
      )}
    </header>
  );
}

export default Navbar;
