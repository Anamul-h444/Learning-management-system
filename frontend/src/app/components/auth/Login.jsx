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
import Modal from "../../utils/Modal";
import useRegisterModal from "../../hooks/useRegisterModal";
import Link from "next/link";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email!").required("Email is required!"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

const inittialValues = { email: "", password: "" };

const Login = () => {
  const [show, setShow] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [registerModal, loginModal]);

  const formik = useFormik({
    initialValues: inittialValues,
    validationSchema: validationSchema,
    onSubmit: async ({ email, password }, onSubmitProps) => {
      console.log(email, password);
      onSubmitProps.resetForm();
    },
  });

  const { errors, touched, values, handleChange, handleSubmit, handleBlur } =
    formik;

  const body = (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
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

        <div className="w-full mt-5 mb-1 flex flex-col relative">
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

        <div>
          <button className="containedButton w-full mt-5" type="submit">
            Login
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
          Not have an account?{" "}
          <span className="text-accent ml-1 cursor-pointer" onClick={onToggle}>
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <Modal
        isOpen={loginModal.isOpen}
        onClose={loginModal.onClose}
        title="Login with Tech Craftsman"
        body={body}
      />
    </>
  );
};

export default Login;
