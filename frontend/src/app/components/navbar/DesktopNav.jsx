import React from "react";
import Link from "next/link";
import { navItemsData } from "../../data/navItemsData";

const DesktopNav = ({ activeItem }) => {
  return (
    <div>
      <div className="hidden lg:flex">
        {navItemsData &&
          navItemsData.map((items, index) => (
            <Link href={`${items.url}`} key={index} passHref>
              <span
                className={`${
                  activeItem === index
                    ? "dark:text-[#37a39a] text-[crimson]"
                    : "dark:text-white text-secondary"
                } text-[18px] px-6 font-Poppins font-[400]`}
              >
                {items.name}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default DesktopNav;
