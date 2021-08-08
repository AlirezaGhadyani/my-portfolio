import React from "react";
import styled from "styled-components";
import FooterBg from "../../Assets/Images/Footer/Background.jpg";
import MyPic from "../../Assets/Images/Footer/My-Pic.jpg";
import moment from "jalali-moment";

// STYLES
const FooterWrapper = styled.footer`
  position: relative;
  width: 100%;
  height: 70vh;
  background: url(${FooterBg}) no-repeat fixed center center / cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  ::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(2px) sepia(20%);
    z-index: -1;
  }
  img {
    width: 10rem;
    border: 0.4rem solid #ecf0f3;
    border-radius: 50%;
    padding: 0.3em;
  }
  .fa__right-txt {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 2.4rem;
    color: #ecf0f3;
  }
  .right-year {
    font-family: "enFont";
    font-size: 1.2rem;
    font-weight: 700;
    color: #ff014f;
  }
  @media (min-width: 576px) {
    img {
      width: 14rem;
    }
    .fa__right-txt {
      font-size: 2rem;
    }
    .right-year {
      font-size: 1.8rem;
    }
  }
`;

const Footer = () => {
  const faDate = moment().locale("fa").format("YYYY/M/D").slice(0, 4);
  const enDate = new Date().getFullYear();

  return (
    <FooterWrapper>
      <img src={MyPic} alt="admin" />
      <p className="fa__right-txt">طراحی و توسعه توسط علیرضا قدیانی</p>
      <span className="right-year">
        {`${faDate} `}&#128526;{` ${enDate}`}
      </span>
    </FooterWrapper>
  );
};

export default Footer;
