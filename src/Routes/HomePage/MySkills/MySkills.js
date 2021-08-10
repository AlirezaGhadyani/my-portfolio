import React, { useEffect, useRef } from "react";
import "./MySkills.css";
import Title from "../../../Components/TitleSection/Title";
import SkillsData from "./SkillData/SkillData";
import SkillCard from "./SkillCard/SkillCard";

const MySkills = ({ setCurrentPage }) => {
  const sectionRef = useRef();
  // SET CURRENT PAGE FOR NAV
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset >= sectionRef.current.offsetTop)
        setCurrentPage("my-skills");
    });
  }, [setCurrentPage]);

  return (
    <section
      className="container my-skills__container"
      id="my-skills"
      ref={sectionRef}
    >
      <div className="my-skills__wrapper">
        <Title subtitle="تخصص من" title="من چه کاری میکنم" />
        <div className="my-skills__card-wrapper">
          {SkillsData.map((item) => (
            <SkillCard data={item} key={item.id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(MySkills);
