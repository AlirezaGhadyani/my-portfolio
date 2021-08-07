import React from "react";
import styled from "styled-components";

// STYLES
const TitleWrapper = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .title__subtitle {
    font-size: 1.3rem;
    font-weight: 600;
    color: #ff014f;
    margin: 0;
    margin-bottom: 0.4em;
  }
  .title__title {
    font-size: 2rem;
    font-weight: 900;
    margin: 0;
  }
`;

const Title = ({ subtitle, title }) => {
  return (
    <TitleWrapper>
      <h3 className="title__subtitle">{subtitle}</h3>
      <h2 className="title__title">{title}</h2>
    </TitleWrapper>
  );
};

export default Title;
