import React, { useEffect } from "react";
import "../Resume.css";
import Title from "../../../../Components/TitleSection/Title";
import ProgressBar from "../../../../Components/ProgressBar/ProgressBar";
import Aos from "aos";
import "aos/dist/aos.css";

const ResumeCuntent = ({ data }) => {
  // AOS ANIM ON SCROLL
  useEffect(() => Aos.init({ duration: 2000 }), []);

  return (
    <div className="resume-cuntent__wrapper" data-aos="zoom-out">
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
        {data.id === 3 && <p>{data.desc}</p>}
        {data.id === 4 && (
          <>
            <p>{data.desc}</p>
            <a href="http://www.studiosabagh.ir/">{data.link}</a>
            <span>{data.ps}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeCuntent;
