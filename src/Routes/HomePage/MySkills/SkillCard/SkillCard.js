import React from "react";
import styled from "styled-components";
import { BsArrowLeftShort } from "react-icons/bs";

// STYLES
const SkillCardWrapper = styled.div`
  position: relative;
  padding: 3em 1.2em 1em 1.2em;
  border-radius: 1rem;
  background: linear-gradient(145deg, #e2e8ec, #ffffff);
  box-shadow: 5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff;
  cursor: pointer;
  z-index: 1;
  div {
    position: relative;
    width: 100%;
    z-index: 3;
    transition: all 0.5s ease-out;
    svg {
      font-size: 3rem;
      color: #ff014f;
    }
    .arrow-icon {
      opacity: 0;
      margin-top: 0.5em;
      transform: translateY(1rem);
      transition: all 0.5s ease;
    }
    h1 {
      font-size: 1.6rem;
      text-transform: capitalize;
    }
    P {
      font-size: 1rem;
      line-height: 1.8rem;
      font-weight: 700;
      color: #878e99;
      margin-bottom: 0;
    }
  }
  ::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 1rem;
    width: 100%;
    height: 100%;
    z-index: 2;
    background: linear-gradient(145deg, #ff014f, #d11414);
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  :hover {
    ::before {
      opacity: 1;
    }
    div {
      transform: translateY(-0.5rem);
      svg {
        color: #fff;
      }
      .arrow-icon {
        opacity: 1;
        transform: translateY(0);
      }
      h1 {
        color: #fff;
      }
      P {
        color: #f0f2f5;
      }
    }
  }
`;

const SkillCard = ({ data }) => {
  const { title, icon, desc } = data;
  return (
    <SkillCardWrapper>
      <div>
        {icon}
        <h1>{title}</h1>
        <p>{desc}</p>
        <BsArrowLeftShort className="arrow-icon" />
      </div>
    </SkillCardWrapper>
  );
};

export default SkillCard;