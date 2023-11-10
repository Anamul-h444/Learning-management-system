"use client";

import React, { useState, useCallback, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

const Modal = ({ isOpen, onClose, title, body }) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  const modal = () => (
    <div
      className="
        max-w-screen h-auto
        bg-neutral-800/70
        fixed inset-0 z-50
        flex justify-center items-center
        overflow-x-hidden overflow-y-auto
        
      "
    >
      {/* Content Container */}
      <div
        className="
          relative
          w-11/12 sm:w-5/6 md:w-4/6 lg:w-3/6 xl:w-[40%] xxl:w-[30%]
          max-h-screen overflow-hidden
          
        "
      >
        {/* Card open and show effect */}
        <div
          className={`
            duration-300
            ${
              showModal
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }
          `}
        >
          {/* Content */}
          <div
            className="
              bg-white
              dark:bg-slate-900
              rounded-lg
              shadow-lg
              w-full h-full
              transform transition-transform pt-5 
            "
          >
            {/* Content Header */}
            <div
              className="
                border-b-[1px]
                rounded-t
                p-2
                flex justify-center items-center
                relative
              "
            >
              <button
                className="
                  absolute left-9
                  hover:opacity-70
                  transition
                "
                onClick={handleClose}
              >
                <IoMdClose
                  size={18}
                  className="text-secondary dark:text-white"
                />
              </button>
              <div className="text-lg font-semibold text-secondary dark:text-white">
                {title}
              </div>
            </div>

            {/* Content body */}
            <div className="p-6 mt-5">{body}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return <>{modal()}</>;
};

export default Modal;
