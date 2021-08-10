import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Title from "../../../Components/TitleSection/Title";
import ContactMePic from "../../../Assets/Images/contact-with-me.jpg";
import ContactMe from "../../../Components/ContactMe/ContactMeStyle";

// STYLES
const ContactCard = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1em;
  padding-bottom: 3em;
  border-radius: 0.8rem;
  background: linear-gradient(145deg, #e2e8ec, #ffffff);
  box-shadow: 5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff;
  @media (min-width: 992px) {
    padding: 2em;
  }
  .contact-img__wrapper {
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    border-radius: 0.8rem;
    cursor: pointer;
    img {
      width: 100%;
      border-radius: 0.8rem;
      transition: transform 0.8s ease;
    }
    :hover {
      img {
        transform: scale(1.2);
      }
    }
  }
  .contact__txt {
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 2.1rem;
  }
  .contact__way {
    font-size: 1.2rem;
    font-weight: 700;
    line-height: 2.2rem;
    margin: 0.5em 0;
    a {
      font-family: "enFont";
      color: #3c3e41;
    }
    span {
      color: #ff014f;
    }
  }
  @media (min-width: 576px) {
    .contact__txt {
      font-size: 2.2rem;
      line-height: 3.4rem;
    }
    .contact__way {
      font-size: 2rem;
      line-height: 3.6rem;
    }
  }
`;

const Contact = ({ setCurrentPage }) => {
  const sectionRef = useRef();
  // SET CURRENT PAGE FOR NAV
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset >= sectionRef.current.offsetTop - 50)
        setCurrentPage("contact-me");
    });
  }, [setCurrentPage]);

  return (
    <section
      className="container contact__container"
      id="contact-me"
      ref={sectionRef}
    >
      <Title subtitle="ارتباط" title="ارتباط با من" />
      <div className="contact__wrapper">
        <ContactCard>
          <div className="contact-img__wrapper">
            <img src={ContactMePic} alt="contact me" />
          </div>
          <p className="contact__txt">
            برای ارتباط با من می توانید از راه های زیر با من تماس بگیرید.
          </p>
          <p className="contact__way">
            <span>ایمیل</span>
            <br />
            <a href="mailto:alirezaghadyani16@gmail.com">
              alirezaghadyani16@gmail
            </a>
          </p>
          <p className="contact__way">
            <span>شماره تلفن</span>
            <br />
            <a href="tel:09300574570">09300574570</a>
          </p>
          <br />
          <br />
          <ContactMe smallversion="true" />
        </ContactCard>
      </div>
    </section>
  );
};

export default Contact;
