import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = ({ user, handleSignout }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const adjustBodyPadding = () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        document.body.style.paddingTop = navbar.offsetHeight + "px";
      }
    };
    adjustBodyPadding();
    window.addEventListener('resize', adjustBodyPadding);
    return () => window.removeEventListener('resize', adjustBodyPadding);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? "scrolled" : ""}`}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand" to="/">
          Car<span className="brand-highlight">X</span>press
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={!isCollapsed}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${!isCollapsed ? "show" : ""}`}>
          <div className="d-flex flex-column flex-lg-row w-100 align-items-center">
            <ul className="navbar-nav me-lg-auto text-center text-lg-start">
              {!user && (
                <>
                  <NavItem to="/" text="Home" onClick={toggleNavbar} />
                  <NavItem to="/About" text="About" onClick={toggleNavbar} />
                </>
              )}

              {user?.role === "admin" && (
                <>
                  <NavItem to="/" text="Home" onClick={toggleNavbar} />
                  <NavItem to="/admin/rentals" text="Rental List" onClick={toggleNavbar} />
                  <NavItem to="/admin/cars" text="Car List" onClick={toggleNavbar} />
                </>
              )}

              {user?.role === "dealer" && (
                <>
                  <NavItem to="/About" text="About" onClick={toggleNavbar} />
                  <NavItem to="/dealer/cars/rentals" text="My Cars & Rentals" onClick={toggleNavbar} />
                  <NavItem to="/dealer/cars/new" text="Add Car" onClick={toggleNavbar} />
                  <NavItem to="/dealer/requests" text="Rental Requests" onClick={toggleNavbar} />
                </>
              )}

              {user?.role === "user" && (
                <>
                  <NavItem to="/" text="Home" onClick={toggleNavbar} />
                  <NavItem to="/About" text="About" onClick={toggleNavbar} />
                  <NavItem to="/cars" text="Cars" onClick={toggleNavbar} />
                  <NavItem to="/my-rentals" text="My Rentals" onClick={toggleNavbar} />
                  <NavItem to="/become-dealer" text="Become a Dealer" onClick={toggleNavbar} />
                </>
              )}
            </ul>

            <ul className="navbar-nav ms-lg-auto text-center">
              {!user ? (
                <>
                  <NavItem to="/signin" text="Sign In" className="navbar-button" onClick={toggleNavbar} />
                  <NavItem to="/signup" text="Sign Up" className="navbar-button" onClick={toggleNavbar} />

                </>
              ) : (
                <li className="nav-item text-center">
                  <button onClick={() => { handleSignout(); setIsCollapsed(true); }} className="navbar-button">
                    Sign Out
                  </button>

                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ to, text, onClick, className = "" }) => (
  <li className="nav-item my-1">
    <Link className={`nav-link ${className}`} to={to} onClick={onClick}>
      {text}
    </Link>
  </li>
);

export default NavBar;