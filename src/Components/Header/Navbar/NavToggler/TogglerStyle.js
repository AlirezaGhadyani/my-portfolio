import styled from "styled-components";

const TogglerButton = styled.button`
  width: 34px;
  height: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  transition: transform 0.6s ease;
  @media (min-width: 992px) {
    display: none;
  }
  .navbar-toggler__line {
    width: 100%;
    height: 4px;
    border-radius: 4rem;
    background: #ff014f;
    transition: transform 0.6s ease 0.2s;
  }
  .navbar-toggler__line:nth-child(2) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    ::after,
    ::before {
      content: "";
      position: absolute;
      width: 34px;
      height: 4px;
      background: #ff014f;
      transition: transform 1s ease 0.4s;
    }
  }
  :hover {
    transform: rotate(90deg);
    .navbar-toggler__line:nth-child(2) {
      transform: rotate(-90deg);
      ::after {
        transform: translateY(-0.5rem);
      }
      ::before {
        transform: translateY(0.5rem);
      }
    }
  }
`;

const NavbarToggler = ({ setOpenNav }) => {
  // OPEN NAVBAR
  const handleOpenNav = () => setOpenNav(true);

  return (
    <TogglerButton onClick={handleOpenNav}>
      <div className="navbar-toggler__line"></div>
      <div className="navbar-toggler__line"></div>
      <div className="navbar-toggler__line"></div>
    </TogglerButton>
  );
};

export default NavbarToggler;
