import React, { useState } from "react";
import "./Navbar.css";
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
      <h1 className="navbar-title">
        <a href="#home">ghadyani</a>
      </h1>
    </div>
  );
};

export default Navbar;
