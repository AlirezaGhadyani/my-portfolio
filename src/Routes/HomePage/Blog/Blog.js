import React, { useEffect, useRef } from "react";
import "./Blog.css";
import Title from "../../../Components/TitleSection/Title";
import BlogData from "./BlogData/BlogData";
import Card from "../../../Components/Card/Card";

const Blog = ({ setCurrentPage }) => {
  const sectionRef = useRef();
  // SET CURRENT PAGE FOR NAV
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset >= sectionRef.current.offsetTop)
        setCurrentPage("blog");
    });
  }, [setCurrentPage]);

  return (
    <section className="container blog__container" id="blog" ref={sectionRef}>
      <div className="blog__wrapper">
        <Title
          subtitle="مطالب روز برنامه نویسی رو بامن دنبال کنید"
          title="بلاگ من"
        />
        <div className="blog-card__wrapper">
          {BlogData.map((item) => (
            <Card data={item} key={item.id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
