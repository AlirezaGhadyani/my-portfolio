import React, { useState } from "react";
import "./Navbar.css";
import NavbarToggler from "./NavToggler/TogglerStyle";
import Nav from "./NavbarNav/Nav";

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  return (
    <div className="navbar-Wrapper">
      <NavbarToggler setOpenNav={setNavbarOpen} />
      <Nav open={navbarOpen} setCloseNav={setNavbarOpen} />
      <h1 className="navbar-title">
        <a href="#">ghadyani</a>
      </h1>
    </div>
  );
};

export default Navbar;
