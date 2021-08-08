import React from "react";
import "./Blog.css";
import Title from "../../../Components/TitleSection/Title";
import BlogData from "./BlogData/BlogData";
import Card from "../../../Components/Card/Card";

const Blog = () => {
  return (
    <section className="container blog__container" id="blog">
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
