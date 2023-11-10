import React, { useEffect, useState } from "react";
import { BiMoon, BiSun } from "react-icons/bi";

const ThemeSwitcher = () => {
  const [toggle, setToggle] = useState(true);

  const handleTheme = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    const html = document.querySelector("html");
    toggle ? html.classList.add("dark") : html.classList.remove("dark");
  }, [toggle]);

  return (
    <div className="dark:text-white" onClick={handleTheme}>
      {toggle ? (
        <BiSun
          className="cursor-pointer text-secondary dark:text-white"
          size={25}
        />
      ) : (
        <BiMoon
          className="cursor-pointer text-secondary dark:text-white"
          size={25}
        />
      )}
    </div>
  );
};

export default ThemeSwitcher;
