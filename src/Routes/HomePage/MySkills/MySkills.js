import React from "react";
import "./MySkills.css";
import Title from "../../../Components/TitleSection/Title";
import SkillsData from "./SkillData/SkillData";
import SkillCard from "./SkillCard/SkillCard";

const MySkills = () => {
  return (
    <section className="container my-skills__container">
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

export default MySkills;
