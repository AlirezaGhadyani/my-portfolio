import React from "react";
import styled from "styled-components";
import { ResumeNavItems } from "../ResumeData/ResumeData";

const ResumeNavWrapper = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 3em 0;
  background: linear-gradient(145deg, #e2e8ec, #ffffff);
  box-shadow: 5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff;
  border-radius: 0.625rem;
  .resume-nav-item {
    width: 100%;
    text-align: center;
    font-size: 1.2rem;
    font-weight: 600;
    padding: 0.8em 0;
    border-radius: 0.625rem;
    transition: all 0.5s ease;
    cursor: pointer;
    :hover {
      color: #ff014f;
      background: linear-gradient(145deg, #e2e8ec, #ffffff);
      box-shadow: 5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff;
    }
  }
  .active {
    color: #ff014f;
    background: linear-gradient(145deg, #e2e8ec, #ffffff);
    box-shadow: 5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff;
  }
  @media (min-width: 375px) {
    .resume-nav-item {
      font-size: 1.5rem;
    }
  }
  @media (min-width: 576px) {
    .resume-nav-item {
      font-size: 1.9rem;
    }
  }
  @media (min-width: 992px) {
    flex-direction: row;
  }
`;

const ResumeNav = ({ activeIndex, setActive }) => {
  const handleSetActive = (id) => setActive(id);

  return (
    <ResumeNavWrapper>
      {ResumeNavItems.map((item) => (
        <li
          className={`resume-nav-item ${
            activeIndex === item.id ? "active" : ""
          }`}
          onClick={() => handleSetActive(item.id)}
          key={item.id}
        >
          {item.title}
        </li>
      ))}
    </ResumeNavWrapper>
  );
};

export default ResumeNav;
