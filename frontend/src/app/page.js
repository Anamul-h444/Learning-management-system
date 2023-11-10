"use client";
import React, { useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/navbar/Header";
import Hero from "./components/Hero";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Verification from "./components/auth/Verification";

const page = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");
  return (
    <div>
      <Heading
        title="Tech Craftsman"
        description="Tech Craftsman is platform for students to learn and get help from teacherw"
        keywords="Programming, MERN, Redux, Next JS, CSS"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <Hero />
      <Login />
      <Signup />
      <Verification />
    </div>
  );
};

export default page;
