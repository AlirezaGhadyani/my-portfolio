import React from "react";
import styled from "styled-components";
import { FiArrowUpLeft } from "react-icons/fi";

// STYLES
const CardWrapper = styled.div`
  position: relative;
  padding: 1.6em;
  padding-bottom: 2em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 1.1rem;
  background: linear-gradient(145deg, #e2e8ec, #ffffff);
  box-shadow: 5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff;
  .portfolio-card__img {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 1.1rem;
    img {
      width: 100%;
      transition: transform 0.8s ease;
    }
    :hover {
      img {
        transform: scale(1.2);
      }
    }
  }
  span {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 1em 0;
    margin-top: 1.6em;
    color: #ff014f;
  }
  a {
    color: #3c3e41;
    font-size: 1.5rem;
    font-weight: 700;
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
`;

const PortfolioCard = ({ data }) => {
  const { img, category, title } = data;
  return (
    <CardWrapper>
      <div className="portfolio-card__img">
        <img src={img} alt={title} />
      </div>
      <span>{category}</span>
      <a href="#">
        {title}
        <br />
        <FiArrowUpLeft />
      </a>
    </CardWrapper>
  );
};

export default PortfolioCard;