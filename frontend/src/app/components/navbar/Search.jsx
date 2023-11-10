import React from "react";

const Search = () => {
  return (
    <div className="flex w-full">
      <input
        className="flex-1 bg-transparent border border-secondary dark:border-white rounded-l-lg p-3 text-secondary dark:text-white  focus:outline-accent-secondary"
        placeholder="Search Courses..."
      />
      <button className="bg-[#37a39a] text-white p-3 rounded-r-lg hover:bg-accent-secondary transition duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  );
};

export default Search;
