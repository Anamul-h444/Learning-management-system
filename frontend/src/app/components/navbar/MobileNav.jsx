import React from "react";
import Link from "next/link";
import { navItemsData } from "../../data/navItemsData";

const MobileNav = ({ activeItem, handleSidebar }) => {
  return (
    <>
      <div className="lg:hidden mt-12">
        {navItemsData &&
          navItemsData.map((items, index) => (
            <Link href={`${items.url}`} key={index} passHref>
              <span
                className={`${
                  activeItem === index
                    ? "dark:text-[#37a39a] text-[crimson]"
                    : "dark:text-white text-secondary"
                } text-[18px] px-6 font-Poppins font-[400] flex flex-col mb-8`}
              >
                <span onClick={() => handleSidebar()}> {items.name}</span>
              </span>
            </Link>
          ))}
      </div>
    </>
  );
};

export default MobileNav;
