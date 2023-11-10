import React from "react";
import Search from "./navbar/Search";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="container">
      <div className="w-full min-h-screen flex flex-col lg:flex-row lg:items-center lg:justify-between lg:space-x-24 mt-10 lg:mt-0 ">
        {/* Hero Images */}
        <div className="w-full mx-auto lg:mt-12 xxl:mt-0">
          <img
            src="/images/hero.jpg"
            alt="Hero image"
            className="rounded-xl w-full"
          />
        </div>

        {/* Hero text */}
        <div className="w-full text-left h-full mt-10  lg:mt-0 ">
          <div className="flex flex-col space-y-8 md:space-y-6  lg:space-y-12">
            <h1 className="text-2xl lg:text-3xl xl:text-4xl text-secondary dark:text-white font-bold text-center lg:text-left">
              Empower Your Journey: Unlock Knowledge with Our Online Learning
              Platform
            </h1>
            <p className="text-secondary dark:text-white text-lg lg:text-xl md:text-lg  xl:text-2xl  text-center lg:text-left">
              We have 20+ online courses & 200k online registered students. Find
              your course from them.
            </p>
            {/* Search bar */}
            <Search />

            {/* Stack */}
            <div className="flex gap-3">
              <div className="flex mb-5 -space-x-4">
                <img
                  className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                  src="/images/1.jpeg"
                  alt=""
                />
                <img
                  className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                  src="/images/2.jpeg"
                  alt=""
                />
                <img
                  className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                  src="/images/3.jpeg"
                  alt=""
                />
                <img
                  className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                  src="/images/4.jpeg"
                  alt=""
                />
                <a
                  className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                  href="#"
                >
                  +99
                </a>
              </div>
              <div className="flex flex-col items-start">
                <span className=" text-secondary dark:text-white text-[13px] xl:text-base tracking-tight lg:tracking-normal ">
                  200k+ students already trusted us
                </span>
                <div>
                  <Link
                    href="#"
                    className="text-[#37a39a] text-[13px] tracking-tight xl:text-base "
                  >
                    View Courses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
