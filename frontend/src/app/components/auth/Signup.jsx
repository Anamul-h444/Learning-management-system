"use client";
import React, { useCallback, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import useLoginModal from "../../hooks/useLoginModal";
import useRegisterModal from "../../hooks/useRegisterModal";
import useVerificationModal from "@/app/hooks/useVerificationModal";
import Modal from "../../utils/Modal";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required!"),
  email: Yup.string().email("Invalid email!").required("Email is required!"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmedPassword: Yup.string().test(
    "passwords-match",
    "Passwords must match",
    function (value) {
      return this.parent.password === value;
    }
  ),
});

const inittialValues = {
  name: "",
  email: "",
  password: "",
  confirmedPassword: "",
};

const Signup = () => {
  const [show, setShow] = useState(false);

  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const verificationModal = useVerificationModal();

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  const formik = useFormik({
    initialValues: inittialValues,
    validationSchema: validationSchema,
    onSubmit: async ({ name, email, password }) => {
      console.log(name, email, password);
      verificationModal.onOpen();
      registerModal.onClose();
    },
  });

  const { errors, touched, values, handleChange, handleSubmit, handleBlur } =
    formik;
  const body = (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        {/* name */}
        <div className="flex flex-col">
          <label className="labelStyle" htmlFor="name">
            Enter Your Name
          </label>
          <input
            type="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            id="name"
            placeholder="Name"
            className={`${
              errors.name && touched.name && "border-red-500"
            } inputStyle `}
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block text-[13px]">
              {errors.name}
            </span>
          )}
        </div>

        {/* email */}
        <div className="flex flex-col mt-5">
          <label className="labelStyle" htmlFor="email">
            Enter Your Email
          </label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            id="email"
            placeholder="example@gmail.com"
            className={`${
              errors.email && touched.email && "border-red-500"
            } inputStyle `}
          />
          {errors.email && touched.email && (
            <span className="text-red-500 pt-2 block text-[13px]">
              {errors.email}
            </span>
          )}
        </div>

        {/* password */}
        <div className="w-full mt-5 relative mb-1 flex flex-col">
          <label className="labelStyle" htmlFor="password">
            Enter Your Password
          </label>
          <div className="relative">
            <input
              type={!show ? "password" : "text"}
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              id="password"
              placeholder="Password"
              className={`${
                errors.password && touched.password && "border-red-500"
              } inputStyle  `}
            />
            {!show ? (
              <AiOutlineEyeInvisible
                className="absolute bottom-3 right-2 z-1 cursor-pointer text-secondary dark:text-white"
                size={20}
                onClick={() => setShow(true)}
              />
            ) : (
              <AiOutlineEye
                size={20}
                onClick={() => setShow(false)}
                className="absolute bottom-3 right-2 z-1 cursor-pointer text-secondary dark:text-white"
              />
            )}
          </div>

          {errors.password && touched.password && (
            <span className="text-red-500 pt-2 block text-[13px]">
              {errors.password}
            </span>
          )}
        </div>

        {/* confirmed password */}
        <div className="w-full mt-5 relative mb-1 flex flex-col">
          <label className="labelStyle" htmlFor="password">
            Re-type Your Password
          </label>

          <div className="relative">
            <input
              type={!show ? "password" : "text"}
              name="confirmedPassword"
              value={values.confirmedPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              id="confirmedPassword"
              placeholder="Confirmed Password"
              className={`${
                errors.confirmedPassword &&
                touched.confirmedPassword &&
                "border-red-500"
              } inputStyle`}
            />
            {!show ? (
              <AiOutlineEyeInvisible
                className="absolute bottom-3 right-2 z-1 cursor-pointer text-secondary dark:text-white"
                size={20}
                onClick={() => setShow(true)}
              />
            ) : (
              <AiOutlineEye
                size={20}
                onClick={() => setShow(false)}
                className="absolute bottom-3 right-2 z-1 cursor-pointer text-secondary dark:text-white"
              />
            )}
          </div>

          {errors.confirmedPassword && touched.confirmedPassword && (
            <span className="text-red-500 pt-2 block text-[13px]">
              {errors.confirmedPassword}
            </span>
          )}
        </div>

        <div>
          <button className="containedButton w-full mt-5" type="submit">
            Register
          </button>
        </div>
      </form>
      <br />

      <div>
        <p className="text-secondary dark:text-white text-center ">
          Or join with
        </p>
        <div className="flex justify-center gap-4 mt-5">
          <FcGoogle className="text-[25px] cursor-pointer" />
          <AiFillGithub className="text-secondary dark:text-white text-[25px] cursor-pointer" />
        </div>
        <div className="text-secondary dark:text-white text-base my-5 text-center">
          Already have an account?{" "}
          <span className="text-accent ml-1 cursor-pointer" onClick={onToggle}>
            Login
          </span>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <Modal
        isOpen={registerModal.isOpen}
        onClose={registerModal.onClose}
        title="Join with Tech Craftsman"
        body={body}
      />
    </>
  );
};

export default Signup;
