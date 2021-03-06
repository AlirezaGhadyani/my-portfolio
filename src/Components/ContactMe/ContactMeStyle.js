import styled from "styled-components";
import { FaGithub, FaWhatsapp, FaInstagram } from "react-icons/fa";

const ContactMeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: ${(props) => (props.gutterSide ? "0 1em" : "")};
`;

const ContactMeTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 900;
  margin: 1em 0.4em;
  @media (min-width: 576px) {
    font-size: ${(props) => (props.smallversion ? "1.2em" : "1.6em")};
  }
`;

const ContactMeWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const ContactMeBtn = styled.a`
  cursor: pointer;
  background: linear-gradient(145deg, #e2e8ec, #ffffff);
  box-shadow: 5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff;
  padding: ${(props) => (props.smallversion ? "0.9em" : "1.4em")};
  margin: 0 0.4em;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.8s ease;
  :hover,
  :focus {
    background: linear-gradient(145deg, #ff014f, #d11414);
    transform: translateY(-0.3rem);
    svg {
      color: #fff;
    }
  }
  svg {
    font-size: ${(props) => (props.smallversion ? "1.6rem" : "2rem")};
    color: #3c3e41;
    stroke-width: 0.4rem;
  }
  @media (min-width: 576px) {
    padding: ${(props) => (props.smallversion ? "0.9em" : "1.6em")};
  }
`;

const ContactMe = ({ gutterSide, smallversion }) => {
  return (
    <ContactMeContainer className="contact-me-icons" gutterSide={gutterSide}>
      <ContactMeTitle smallversion={smallversion}>
        با من در ارتباط باشید
      </ContactMeTitle>
      <ContactMeWrapper>
        <ContactMeBtn
          smallversion={smallversion}
          href="https://github.com/AlirezaGhadyani"
        >
          <FaGithub smallversion={smallversion} />
        </ContactMeBtn>
        <ContactMeBtn
          smallversion={smallversion}
          href="https://wa.me/09300574570"
        >
          <FaWhatsapp smallversion={smallversion} />
        </ContactMeBtn>
        <ContactMeBtn
          smallversion={smallversion}
          href="https://www.instagram.com/allireza_ghadyani/"
        >
          <FaInstagram smallversion={smallversion} />
        </ContactMeBtn>
      </ContactMeWrapper>
    </ContactMeContainer>
  );
};

export default ContactMe;
