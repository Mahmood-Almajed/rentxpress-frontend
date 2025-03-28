import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = ({ user, handleSignout }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const navbarHeight = document.getElementById("ftco-navbar")?.offsetHeight || 0;
    document.body.style.paddingTop = `${navbarHeight}px`;
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark bg-dark fixed-top ftco_navbar ftco-navbar-light ${
        isCollapsed ? "" : "scrolled awake"
      }`}
      id="ftco-navbar"
    >
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Rent<span className="text-warning fw-bold">X</span>press
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="ftco-nav"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${!isCollapsed ? "show" : ""}`} id="ftco-nav">
          <ul className="navbar-nav text-center">
            {user?.role === "admin" && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/rentals">Rental List</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/cars">Car List</Link></li>
              </>
            )}
            {user?.role === "dealer" && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/About">About</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/dealer/cars/rentals">My Cars & Rentals</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/dealer/cars/new">Add Car</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/dealer/requests">Rental Requests</Link></li>
              </>
            )}
            {user?.role === "user" && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/About">About</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/cars">Cars</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/my-rentals">My Rentals</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/become-dealer">Become a Dealer</Link></li>
              </>
            )}
            {!user && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/About">About</Link></li>
              </>
            )}
          </ul>

          <div className="auth-buttons">
            {!user ? (
              <>
                <Link className="btn btn-outline-light me-2 mb-2 mb-lg-0" to="/signin">
                  Sign In
                </Link>
                <Link className="btn btn-warning text-dark mb-2 mb-lg-0" to="/signup">
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleSignout}
                className="btn btn-outline-light mb-2 mb-lg-0"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
