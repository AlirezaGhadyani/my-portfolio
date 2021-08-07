import React from "react";
import AboutMe from "./AboutMe/AboutMe";
import MySkills from "./MySkills/MySkills";
import Portfolio from "./Portfolio/Portfolio";
import Resume from "./Resume/Resume";

const Home = () => {
  return (
    <main>
      <AboutMe />
      <MySkills />
      <Portfolio />
      <Resume />
    </main>
  );
};

export default Home;
