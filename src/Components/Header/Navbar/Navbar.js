import React from "react";
import "./Navbar.css";
import NavbarToggler from "./NavToggler/TogglerStyle";
import Nav from "./NavbarNav/Nav";

const Navbar = () => {
  return (
    <div className="navbar-Wrapper">
      <NavbarToggler />
      <Nav />
    </div>
  );
};

export default Navbar;
