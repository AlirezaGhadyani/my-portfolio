import React from "react";
import { NavbarNavContainer, CloseToggler } from "./NavStyle";
import { FaTimes } from "react-icons/fa";
import ContactMe from "../../../ContactMe/ContactMeStyle";

const navItems = [
  {
    title: "خانه",
    path: "#",
    id: 1,
  },
  {
    title: "تخصص من",
    path: "",
    id: 2,
  },
  {
    title: "نمونه کارهام",
    path: "#",
    id: 3,
  },
  {
    title: "رزومه من",
    path: "#",
    id: 4,
  },
  {
    title: "بلاگ",
    path: "#",
    id: 5,
  },
  {
    title: "ارتباط بامن",
    path: "#",
    id: 6,
  },
];

const Nav = () => {
  return (
    <NavbarNavContainer>
      <CloseToggler>
        <FaTimes />
      </CloseToggler>
      <ul className="navbar-list">
        {navItems.map((item) => (
          <li className="nav-item">
            <a href={item.path} className="nav-link">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
      <ContactMe />
    </NavbarNavContainer>
  );
};

export default Nav;
