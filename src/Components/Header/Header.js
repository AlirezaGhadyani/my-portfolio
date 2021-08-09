import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Navbar from "./Navbar/Navbar";

// STYLES
const HeaderContainer = styled.header`
  width: 100%;
  position: relative;
  background: #ecf0f3;
  transition: all 0.5s ease;
  z-index: 1000;
  &.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    box-shadow: 10px 10px 19px rgb(0 0 0 / 10%);
  }
`;

const Header = ({ currentPage }) => {
  const [fixedHeader, setFixedHeader] = useState(false);

  // SET HEADER FIXED
  useEffect(() => {
    window.addEventListener("scroll", () => {
      window.scrollY > 300 ? setFixedHeader(true) : setFixedHeader(false);
    });
  }, []);

  return (
    <HeaderContainer className={fixedHeader ? "fixed-header" : ""}>
      <Navbar currentPage={currentPage} />
    </HeaderContainer>
  );
};

export default Header;
