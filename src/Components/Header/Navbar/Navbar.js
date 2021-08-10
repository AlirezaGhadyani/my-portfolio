import React, { useState } from "react";
import "./Navbar.css";
import MainLogo from "../../../Assets/Images/main-logo.png";
import NavbarToggler from "./NavToggler/TogglerStyle";
import Nav from "./NavbarNav/Nav";

const Navbar = ({ currentPage }) => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  return (
    <div className="navbar-Wrapper">
      <NavbarToggler setOpenNav={setNavbarOpen} />
      <Nav
        open={navbarOpen}
        setCloseNav={setNavbarOpen}
        currentPage={currentPage}
      />
      <a href="#home" className="navbar-title">
        <img src={MainLogo} alt="main logo" />
      </a>
    </div>
  );
};

export default Navbar;
