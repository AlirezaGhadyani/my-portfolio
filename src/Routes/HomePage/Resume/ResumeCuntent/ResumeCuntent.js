import React from "react";
import "../Resume.css";
import Title from "../../../../Components/TitleSection/Title";
import ProgressBar from "../../../../Components/ProgressBar/ProgressBar";

const ResumeCuntent = ({ data }) => {
  return (
    <div className="resume-cuntent__wrapper">
      <Title subtitle={data.subtitle} title={data.title} align="flex-start" />
      <div
        className={`resume-cuntent__box ${data.id === 2 ? "skills-box" : ""}`}
      >
        {data.id === 1 && (
          <>
            <h2>{data.cuntentTitle}</h2>
            <p>{data.desc}</p>
          </>
        )}
        {data.id === 2 &&
          data.skills.map((skill) => (
            <ProgressBar
              name={skill.name}
              precent={skill.precent}
              key={skill.id}
            />
          ))}
      </div>
    </div>
  );
};

export default ResumeCuntent;
