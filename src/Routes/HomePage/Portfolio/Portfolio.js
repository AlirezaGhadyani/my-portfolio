import React, { useEffect, useRef } from "react";
import Title from "../../../Components/TitleSection/Title";
import portfolioData from "./PortfolioData/PortfolioData";
import Card from "../../../Components/Card/Card";

const Portfolio = ({ setCurrentPage }) => {
  const sectionRef = useRef();
  // SET CURRENT PAGE FOR NAV
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset >= sectionRef.current.offsetTop)
        setCurrentPage("portfolio");
    });
  }, [setCurrentPage]);

  return (
    <section
      className="container portfolio__container"
      id="portfolio"
      ref={sectionRef}
    >
      <div className="portfolio__wrapper">
        <Title subtitle="نمونه کارهای بیشتر در گیت هاب" title="نمونه کارها" />
        <div className="portfolio-card__wrapper">
          {portfolioData.map((item) => (
            <Card data={item} key={item.id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
