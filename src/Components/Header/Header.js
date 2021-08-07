import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Navbar from "./Navbar/Navbar";

// STYLES
const HeaderContainer = styled.header`
  width: 100%;
  position: absolute;
  top: 0;
  background: #ecf0f3;
  transition: all 0.5s ease;
  z-index: 1000;
  &.fixed-header {
    position: fixed;
    box-shadow: 10px 10px 19px rgb(0 0 0 / 10%);
  }
`;

const Header = () => {
  const [fixedHeader, setFixedHeader] = useState(false);

  // SET HEADER FIXED
  useEffect(() => {
    window.addEventListener("scroll", () => {
      window.scrollY > 300 ? setFixedHeader(true) : setFixedHeader(false);
    });
  }, []);

  return (
    <HeaderContainer className={fixedHeader ? "fixed-header" : ""}>
      <Navbar />
    </HeaderContainer>
  );
};

export default Header;
