import React, { useState } from "react";
import "./Home.css";
import Header from "../../Components/Header/Header";
import AboutMe from "./AboutMe/AboutMe";
import MySkills from "./MySkills/MySkills";
import Portfolio from "./Portfolio/Portfolio";
import Resume from "./Resume/Resume";
import Blog from "./Blog/Blog";
import Contact from "./Contact/Contact";

const Home = () => {
  const [currentPage, setCurrentPage] = useState("home");
  return (
    <>
      <Header currentPage={currentPage} />
      <main id="home">
        <AboutMe setCurrentPage={setCurrentPage} />
        <MySkills setCurrentPage={setCurrentPage} />
        <Portfolio setCurrentPage={setCurrentPage} />
        <Resume setCurrentPage={setCurrentPage} />
        <Blog setCurrentPage={setCurrentPage} />
        <Contact setCurrentPage={setCurrentPage} />
      </main>
    </>
  );
};

export default Home;
