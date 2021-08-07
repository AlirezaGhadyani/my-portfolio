import styled from "styled-components";
import { FaGithub, FaWhatsapp, FaInstagram } from "react-icons/fa";

const ContactMeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0 1em;
`;

const ContactMeTitle = styled.h2`
  font-size: 0.9rem;
  font-weight: 900;
  margin: 1em 0.4em;
`;

const ContactMeWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const ContactMeBtn = styled.button`
  border: 0;
  cursor: pointer;
  background: linear-gradient(145deg, #e2e8ec, #ffffff);
  box-shadow: 5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff;
  padding: 0.9em;
  margin: 0 0.4em;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.8s ease;
  :hover {
    background: linear-gradient(145deg, #ff014f, #d11414);
    transform: translateY(-0.3rem);
    svg {
      color: #fff;
    }
  }
  svg {
    font-size: 1.6rem;
    color: #3c3e41;
    stroke-width: 0.4rem;
  }
`;

const ContactMe = () => {
  return (
    <ContactMeContainer className="contact-me-icons">
      <ContactMeTitle>با من در ارتباط باشید</ContactMeTitle>
      <ContactMeWrapper>
        <ContactMeBtn>
          <FaGithub />
        </ContactMeBtn>
        <ContactMeBtn>
          <FaWhatsapp />
        </ContactMeBtn>
        <ContactMeBtn>
          <FaInstagram />
        </ContactMeBtn>
      </ContactMeWrapper>
    </ContactMeContainer>
  );
};

export default ContactMe;
