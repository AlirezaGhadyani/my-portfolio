import React from "react";
import styled from "styled-components";
import Navbar from "./Navbar/Navbar";

// STYLES
const HeaderContainer = styled.header`
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Navbar />
    </HeaderContainer>
  );
};

export default Header;
