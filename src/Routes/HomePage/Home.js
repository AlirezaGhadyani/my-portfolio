import React from "react";
import "./Home.css";
import AboutMe from "./AboutMe/AboutMe";
import MySkills from "./MySkills/MySkills";
import Portfolio from "./Portfolio/Portfolio";
import Resume from "./Resume/Resume";
import Blog from "./Blog/Blog";
import Contact from "./Contact/Contact";

const Home = () => {
  return (
    <main>
      <AboutMe />
      <MySkills />
      <Portfolio />
      <Resume />
      <Blog />
      <Contact />
    </main>
  );
};

export default Home;
