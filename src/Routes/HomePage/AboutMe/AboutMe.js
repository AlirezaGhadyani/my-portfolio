import React from "react";
import "./AboutMe.css";
import ContactMe from "../../../Components/ContactMe/ContactMeStyle";
import HeadImg from "../../../Assets/Images/my-picture.jpg";

const AboutMe = () => {
  return (
    <section className="container about-me__container">
      <div className="about-me__wrapper">
        <div className="about-me__img">
          <img src={HeadImg} alt="my picture" />
        </div>
        <div className="about-me__about-cuntent">
          <h1 className="about-cuntent__title">
            سلام من <span>علیرضا قدیانی</span>
            <br />
            هستم <span>برنامه نویس فرانت اند</span>
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
