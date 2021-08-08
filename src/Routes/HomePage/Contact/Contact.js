import React from "react";
import styled from "styled-components";
import Title from "../../../Components/TitleSection/Title";
import ContactMePic from "../../../Assets/Images/contact-with-me.png";
import ContactMe from "../../../Components/ContactMe/ContactMeStyle";

// STYLES
const ContactCard = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.6em;
  padding-bottom: 3em;
  border-radius: 1.1rem;
  background: linear-gradient(145deg, #e2e8ec, #ffffff);
  box-shadow: 5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff;
  .contact-img__wrapper {
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    border-radius: 1.1rem;
    cursor: pointer;
    img {
      width: 100%;
      border-radius: 1.1rem;
      transition: transform 0.8s ease;
    }
    :hover {
      img {
        transform: scale(1.2);
      }
    }
  }
  .contact__txt {
    font-size: 1.7rem;
    font-weight: 500;
    line-height: 2.4rem;
  }
  .contact__way {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0.5em 0;
    a {
      font-family: "enFont";
      color: #3c3e41;
    }
    span {
      color: #ff014f;
    }
  }
`;

const Contact = () => {
  return (
    <section className="container contact__container" id="contact-me">
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
            <span>ایمیل : </span>
            <a href="mailto:alirezaghadyani16@gmail.com">
              alirezaghadyani16@gmail.com
            </a>
          </p>
          <p className="contact__way">
            <span>شماره تلفن : </span>
            <a href="tel:09300574570">09300574570</a>
          </p>
          <br />
          <br />
          <ContactMe />
        </ContactCard>
      </div>
    </section>
  );
};

export default Contact;
