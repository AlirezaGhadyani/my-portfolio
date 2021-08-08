import React, { useState } from "react";
import "./Resume.css";
import Title from "../../../Components/TitleSection/Title";
import ResumeNav from "./ResumeNav/ResumeNav";
import ResumeCuntent from "./ResumeCuntent/ResumeCuntent";
import { ResumeCuntents } from "./ResumeData/ResumeData";

const Resume = () => {
  const [resumeIndex, setResumeIndex] = useState(1);

  return (
    <section className="container resume__container">
      <div className="resume__wrapper">
        <Title subtitle="جونیور فرانت اند دولوپر" title="رزومه من" />
        <ResumeNav activeIndex={resumeIndex} setActive={setResumeIndex} />
        <div className="resume-cuntent__wrapper">
          {ResumeCuntents.map(
            (item) =>
              item.id === resumeIndex && (
                <ResumeCuntent data={item} key={item.id} />
              )
          )}
        </div>
      </div>
    </section>
  );
};

export default Resume;