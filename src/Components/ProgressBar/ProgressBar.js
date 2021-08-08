import React, { useState, useEffect } from "react";
import styled from "styled-components";

// STYLES
const ProgressBarWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  margin: 1.4em;
  .progressbar__name {
    font-family: "enFont";
    font-size: 1.5rem;
    font-weight: 500;
    text-transform: capitalize;
    margin: 0;
    margin-bottom: 1em;
    @media (min-width: 576px) {
      font-size: 2.2rem;
    }
    @media (min-width: 992px) {
      font-size: 1.7rem;
    }
  }
  .progressbar__progress-wrapper {
    position: relative;
    width: 100%;
    background: #dce1e4;
    height: 0.6rem;
    border-radius: 10rem;
    direction: ltr;
  }
`;

const ProgressBarProgress = styled.div`
  position: relative;
  width: 0;
  height: 100%;
  border-radius: 10rem;
  background: linear-gradient(145deg, #fff 0%, #ff014f 100%);
  opacity: 0;
  transition: all 2s linear;
  &.animate {
    width: ${(props) => props.width + `%`};
    opacity: 1;
  }
  ::before {
    content: "${(props) => props.width}%";
    font-family: "enFont";
    font-size: 1rem;
    position: absolute;
    bottom: 1.4em;
    right: -1em;
  }
  @media (min-width: 576px) {
    ::before {
      font-size: 1.6rem;
    }
  }
  @media (min-width: 992px) {
    ::before {
      font-size: 1.4rem;
    }
  }
`;

const ProgressBar = ({ name, precent }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 500);

    return () => setAnimate(false);
  }, []);

  return (
    <ProgressBarWrapper>
      <h3 className="progressbar__name">{name}</h3>
      <div className="progressbar__progress-wrapper">
        <ProgressBarProgress
          className={animate ? "animate" : ""}
          width={precent}
        />
      </div>
    </ProgressBarWrapper>
  );
};

export default ProgressBar;
