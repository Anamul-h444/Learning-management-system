import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import useLoginModal from "@/app/hooks/useLoginModal";
import useVerificationModal from "@/app/hooks/useVerificationModal";
import Modal from "@/app/utils/Modal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import { useSelector } from "react-redux";
import { useActivationMutation } from "../../../../redux/features/auth/authApi";

const Verification = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const verificationModal = useVerificationModal();

  const [invalidError, setInvalidError] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [verifyNumber, setVerifyNumber] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const token = useSelector((state) => state.auth.token);
  const [activation, { isSuccess, error, data }] = useActivationMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Account Activated successful";
      toast.success(message);
      verificationModal.onClose();
      loginModal.onOpen();
    }
    if (error) {
      if ("data" in error) {
        const errorData = error;
        toast.error(errorData.data.message);
        setInvalidError(true);
      }
    }
  }, [isSuccess, error]);

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }
    await activation({
      activationToken: token,
      activationCode: verificationNumber,
    });
  };

  const handleInputChange = (index, value) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const onToggle = useCallback(() => {
    verificationModal.onClose();
    registerModal.onClose();
    loginModal.onOpen();
  }, [verificationModal, loginModal]);

  const body = (
    <div>
      <div className="w-full flex items-center justify-center mt-2">
        <VscWorkspaceTrusted
          size={40}
          className="text-secondary dark:text-white"
        />
      </div>
      <br />
      <br />
      <div className=" m-auto flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="number"
            key={key}
            ref={inputRefs[index]}
            className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center justify-center text-secondary dark:text-white text-[18px] outline-none text-center ${
              invalidError
                ? "shake-animation border-red-500"
                : "dark:border-white border-[#0000004a]"
            }`}
            placeholder=""
            maxLength={1}
            value={verifyNumber[key]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <br />
      <br />
      <div>
        <button
          className="containedButton w-full mt-5"
          onClick={verificationHandler}
        >
          Verify OTP
        </button>
      </div>
      <br />
      <h5 className="text-center pt-4 text-[14px] text-secondary dark:text-white ">
        Go back to sign in?{" "}
        <span className="text-accent pl-1 cursor-pointer" onClick={onToggle}>
          Sign in
        </span>
      </h5>
    </div>
  );

  return (
    <>
      <Modal
        isOpen={verificationModal.isOpen}
        onClose={verificationModal.onClose}
        title="Verify your account"
        body={body}
      />
    </>
  );
};

export default Verification;
