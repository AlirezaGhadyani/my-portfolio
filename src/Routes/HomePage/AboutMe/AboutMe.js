import React, { useEffect, useRef } from "react";
import "./AboutMe.css";
import ContactMe from "../../../Components/ContactMe/ContactMeStyle";
import HeadImg from "../../../Assets/Images/my-picture.jpg";
import Typical from "react-typical";

const typicalSteps = [
  "برنامه نویس فرانت اند",
  2000,
  "برنامه نویس ریکت",
  2000,
  "برنامه نویس جاوااسکریپت",
  2000,
];

const AboutMe = ({ setCurrentPage }) => {
  const sectionRef = useRef();
  // SET CURRENT PAGE FOR NAV
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset >= sectionRef.current.offsetTop)
        setCurrentPage("home");
    });
  }, [setCurrentPage]);
  return (
    <section
      className="container about-me__container"
      id="about-me"
      ref={sectionRef}
    >
      <div className="about-me__wrapper">
        <div className="about-me__img">
          <img src={HeadImg} alt="admins" />
        </div>
        <div className="about-me__about-cuntent">
          <h1 className="about-cuntent__title">
            سلام من <span>علیرضا قدیانی</span>
            <br />
            هستم{" "}
            <span>
              <Typical loop={Infinity} wrapper="span" steps={typicalSteps} />
            </span>
          </h1>
          <p className="about-cuntent__txt">
            18 ساله متولد 25 آذر 1381 , ساکن تهران علاقه مند به برنامه نویسی و
            طراحی وب سایت , جونیور در حوزه فرانت اند و آماده کسب تجربه , مسئولیت
            و همکاری با مجموعه ای حرفه ای
          </p>
          <ContactMe />
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
