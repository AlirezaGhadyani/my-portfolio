import React from "react";
import "./Portfolio.css";
import Title from "../../../Components/TitleSection/Title";
import portfolioData from "./PortfolioData/PortfolioData";
import PortfolioCard from "./PortfolioCard/PortfolioCard";

const Portfolio = () => {
  return (
    <section className="container portfolio__container">
      <div className="portfolio__wrapper">
        <Title subtitle="نمونه کارهای بیشتر در گیت هاب" title="نمونه کارها" />
        <div className="portfolio-card__wrapper">
          {portfolioData.map((item) => (
            <PortfolioCard data={item} key={item.id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
