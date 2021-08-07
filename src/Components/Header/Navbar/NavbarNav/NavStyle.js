import styled from "styled-components";

export const NavbarNavContainer = styled.nav`
  position: fixed;
  right: 0;
  top: 0;
  overflow: hidden;
  width: 240px;
  max-width: 100%;
  height: 100vh;
  background: linear-gradient(145deg, #e2e8ec, #ffffff);
  box-shadow: 8px 0 15px rgba(0, 0, 0, 0.4);
  transform: translateX(100%);
  transition: all 0.8s ease;
  z-index: 1000;
  &.open {
    transform: translateX(0%);
  }
`;

export const CloseToggler = styled.button`
  border: 0;
  background: linear-gradient(145deg, #e2e8ec, #ffffff);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.6em;
  margin: 1em;
  border-radius: 50%;
  box-shadow: 5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff;
  svg {
    color: #ff014f;
    font-size: 1.4rem;
  }
`;
