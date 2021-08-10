import React, { useEffect } from "react";
import styled from "styled-components";
import { FiArrowUpLeft } from "react-icons/fi";
import Aos from "aos";
import "aos/dist/aos.css";

// STYLES
const CardWrapper = styled.div`
  position: relative;
  padding: 1em;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 0.8rem;
  background: linear-gradient(145deg, #e2e8ec, #ffffff);
  box-shadow: 5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff;
  height: fit-content;
  @media (min-width: 992px) {
    padding: 1.5em;
    height: 100%;
  }
  .portfolio-card__img {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 0.8rem;
    img {
      width: 100%;
      transition: transform 1.5s ease;
    }
    :hover {
      img {
        transform: scale(1.2);
      }
    }
  }
  span {
    font-size: 1rem;
    font-weight: 600;
    margin: 1em 0;
    margin-top: 1.6em;
    color: #ff014f;
  }
  a {
    color: #3c3e41;
    font-size: 1.2rem;
    font-weight: 700;
    line-height: 2.1rem;
    margin: 0;
    transition: all 0.3s ease;
    cursor: pointer;
    svg {
      position: relative;
      top: 1em;
      margin-top: 0.4em;
      align-self: flex-end;
      font-size: 0;
      color: #ff014f;
      opacity: 0;
      transition: all 0.5s ease;
    }
  }
  a:hover {
    color: #ff014f;
    svg {
      opacity: 1;
      top: 0.4em;
      font-size: 2rem;
    }
  }
  @media (min-width: 375px) {
    span {
      font-size: 1.3rem;
    }
    a {
      font-size: 1.5rem;
    }
  }
  @media (min-width: 576px) {
    span {
      font-size: 1.6rem;
    }
    a {
      font-size: 2rem;
      line-height: 3rem;
    }
  }
  @media (min-width: 992px) {
    span {
      font-size: 1.2rem;
    }
    a {
      font-size: 1.4rem;
      line-height: 3rem;
    }
  }
`;

const Card = ({ data }) => {
  const { img, category, title, path } = data;

  // AOS ANIM ON SCROLL
  useEffect(() => Aos.init({ duration: 1500 }), []);

  return (
    <CardWrapper data-aos="flip-down">
      <div className="portfolio-card__img">
        <img src={img} alt={title} />
      </div>
      <span>{category}</span>
      <a href={path ? path : "#"}>
        {title}
        <br />
        <FiArrowUpLeft />
      </a>
    </CardWrapper>
  );
};

export default Card;
