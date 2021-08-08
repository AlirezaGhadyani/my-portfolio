import React, { useState } from "react";
import { NavbarNavContainer, CloseToggler } from "./NavStyle";
import { FaTimes } from "react-icons/fa";
import ContactMe from "../../../ContactMe/ContactMeStyle";

const navItems = [
  {
    title: "خانه",
    name: "home",
    path: "#about-me",
    id: 1,
  },
  {
    title: "تخصص من",
    name: "my-skills",
    path: "#my-skills",
    id: 2,
  },
  {
    title: "نمونه کارهام",
    name: "portfolio",
    path: "#portfolio",
    id: 3,
  },
  {
    title: "رزومه من",
    name: "resume",
    path: "#resume",
    id: 4,
  },
  {
    title: "بلاگ",
    name: "blog",
    path: "#blog",
    id: 5,
  },
  {
    title: "ارتباط بامن",
    name: "contact-me",
    path: "#contact-me",
    id: 6,
  },
];

const Nav = ({ open, setCloseNav }) => {
  const [currentPage, setCurrentPage] = useState("home");
  // CLOSE NAVBAR
  const handleCloseNav = () => setCloseNav(false);
  // SET CURRENT PAGE
  const handleSetCurrentPage = (name) => {
    if (currentPage === name) return "current-page";
    else return "";
  };

  return (
    <NavbarNavContainer className={open ? "open" : ""}>
      <CloseToggler onClick={handleCloseNav}>
        <FaTimes />
      </CloseToggler>
      <ul className="navbar-list">
        {navItems.map((item) => (
          <li
            className={`nav-item ${handleSetCurrentPage(item.name)}`}
            key={item.id}
          >
            <a href={item.path} className="nav-link">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
      <ContactMe gutterSide smallversion="true" />
    </NavbarNavContainer>
  );
};

export default Nav;
