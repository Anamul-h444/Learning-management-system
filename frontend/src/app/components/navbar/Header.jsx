"use client";
import Link from "next/link";
import React, { useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import MobileNav from "./MobileNav";
import DesktopNav from "./DesktopNav";
import useLoginModal from "../../hooks/useLoginModal";
import { IoMdClose } from "react-icons/io";

const Header = ({ open, setOpen, activeItem }) => {
  const loginModal = useLoginModal();
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  const handleSidebar = () => {
    setOpenSidebar(false);
  };

  const handleSidebarAndModal = () => {
    setOpenSidebar(false); // Close the sidebar
    loginModal.onOpen(); // Open the modal
  };

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl tranistion duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
        }`}
      >
        <div className="container mx-auto py-2 h-full">
          {/* desktop nav */}
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            {/* logo */}
            <div>
              <Link href={"/"}>
                <span className="text-[25px] font-Poppins font-[500] text-secondary dark:text-white">
                  Tech Craftsman
                </span>
              </Link>
            </div>
            {/* nav items */}
            <div className="flex items-center gap-6">
              <DesktopNav activeItem={activeItem} />
              <ThemeSwitcher />
              {/* only for mobile */}
              <div className="lg:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer dark:text-white text-secondary"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
              <div className="hidden lg:block">
                <HiOutlineUserCircle
                  size={25}
                  className="cursor-pointer dark:text-white text-secondary"
                  onClick={loginModal.onOpen}
                />
              </div>
            </div>
          </div>
        </div>

        {/* mobile sidebar */}
        {openSidebar && (
          <div className="fixed w-full h-screen top-0 left-0 z-[9999] dark:bg-[unset] bg-[#00000024]">
            <div className="lg:hidden w-[50%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
              <IoMdClose
                onClick={handleSidebar}
                className="text-[25px] text-secondary dark:text-white absolute right-2 top-12 cursor-pointer"
              />
              <MobileNav
                activeItem={activeItem}
                handleSidebar={handleSidebar}
              />
              <HiOutlineUserCircle
                size={25}
                className="cursor-pointer dark:text-white text-secondary ml-5 my-2"
                onClick={handleSidebarAndModal}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
