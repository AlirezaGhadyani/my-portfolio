import React, { useState, useRef, useEffect } from "react";
import "./Resume.css";
import Title from "../../../Components/TitleSection/Title";
import ResumeNav from "./ResumeNav/ResumeNav";
import ResumeCuntent from "./ResumeCuntent/ResumeCuntent";
import { ResumeCuntents } from "./ResumeData/ResumeData";

const Resume = ({ setCurrentPage }) => {
  const [resumeIndex, setResumeIndex] = useState(1);
  const sectionRef = useRef();
  // SET CURRENT PAGE FOR NAV
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset >= sectionRef.current.offsetTop - 50)
        setCurrentPage("resume");
    });
  }, [setCurrentPage]);

  return (
    <section
      className="container resume__container"
      id="resume"
      ref={sectionRef}
    >
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
        <a
          href="https://drive.google.com/file/d/1mHapcbxxpXruHKWNjQFwzdATD55-RllZ/view?usp=sharing"
          className="resume__pdf-link"
        >
          برای مشاهده فایل رزومه من کلیک کنید
        </a>
      </div>
    </section>
  );
};

export default Resume;
