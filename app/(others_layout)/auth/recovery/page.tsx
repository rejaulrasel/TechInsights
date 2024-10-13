"use client";

import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { GetProps, Input } from "antd";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

import sendEmail from "../../../../utils/send_notification_email";
import {
  TAuthEmail,
  INotificationEmail,
} from "../../../../interface/email.notification.interface";

import demoProfile from "./demo.png";
type OTPProps = GetProps<typeof Input.OTP>;

interface TAxiosResponse {
  name: string;
  email: string;
  photo: string;
  token: string;
}

const WRONG_EMAIL_LIMIT = 3;
const LOCK_TIME = 15 * 60 * 1000;

const Recover: FC = () => {
  const [user, setUser] = useState<TAxiosResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const [openModal, setOpenModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  const [passed, setPassed] = useState<boolean>(false);
  const router = useRouter();

  const handleFindUser = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setError("Searching...");
    const email = (event.target as HTMLFormElement).email.value;

    try {
      const res = await axios.get<{ success: boolean; data: TAxiosResponse }>(
        `${process.env.NEXT_PUBLIC_BASE_API}/api/auth/recovery`,
        {
          params: {
            email,
          },
        }
      );
      if (res?.data?.success) {
        setFailedAttempts(0);
        setUser(res.data?.data as TAxiosResponse);
        setError(null);
      } else {
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);

        const remainingAttempts = WRONG_EMAIL_LIMIT - newFailedAttempts;

        if (newFailedAttempts >= WRONG_EMAIL_LIMIT) {
          const lockUntil = new Date(Date.now() + LOCK_TIME);
          setIsLocked(true);
          localStorage.setItem("lockTime", lockUntil.toString());
          setError(
            `Bro! Too many failed attempts. Session restricted for 15 minutes.`
          );
        } else {
          setError(
            `Invalid email. You have ${remainingAttempts} attempt(s) left.`
          );
        }
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  const handleSendVerificationEmail = async () => {
    const toastId = toast.loading("Sending Email...");
    const sixDigitCode = String(Math.floor(100000 + Math.random() * 900000));
    setVerificationCode(sixDigitCode);

    // DONE: Email verification code to user for rest password
    const EMAIL_PARAMS: TAuthEmail = {
      subject: "Your OTP Code",
      receiver_name: user?.name as string,
      receiver_email: user?.email as string,
      description: `Your OTP code is ${sixDigitCode}`,
      otp: sixDigitCode as string,
    };

    try {
      const res = await sendEmail(EMAIL_PARAMS);
      if (res?.status == 200) {
        toast.success(
          "You have been emailed with a 6 digit code. If you do not find the email in your inbox, please check your spam or junk folder",
          { id: toastId }
        );
        setOpenModal(true);
      }
    } catch (error) {
      toast.error(
        "For an unknown reason we failed to send you the verification email. Please try again",
        {
          id: toastId,
        }
      );
      setUser(null);
    }
  };

  const onChange: OTPProps["onChange"] = (inputtedVerificationCode) => {
    setError(null);
    if (inputtedVerificationCode !== verificationCode) {
      setError("Uhh Bro! OTP did not match. Check again");
      return;
    }
    setPassed(true);
    setOpenModal(false);
  };

  const sharedProps: OTPProps = {
    onChange,
  };

  const handleChangePassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError(null);
    const toastId = toast.loading("Working...");
    const password = (event.target as HTMLFormElement)?.password?.value;
    const password2 = (event.target as HTMLFormElement)?.password2?.value;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        `Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character`
      );
      toast.dismiss(toastId);
      return;
    } else if (password !== password2) {
      setError(`Password did not match`);
      toast.dismiss(toastId);
      return;
    } else {
      // DONE: call the server to set new password;
      const res = await axios.patch<{ success: boolean; message: string }>(
        `https://car-rental-server-new-v1.vercel.app/api/auth/user/recovery/passed`,
        {
          token: user?.token,
          newPassword: password,
        }
      );
      if (res.data.success) {
        const EMAIL_PARAMS: INotificationEmail = {
          subject: "Welcome back",
          receiver_name: user?.name as string,
          receiver_email: user?.email as string,
          description: `We happy to inform you that your TechInsights account has been successfully recovered. You can now log in to your account using your new password. 
                    
                    If you did not initiate this password recovery, please contact our support team immediately.`,
        };

        const emailjsRes = await sendEmail(EMAIL_PARAMS);
        if (emailjsRes?.status === 200) {
          toast.success(res.data.message, { id: toastId });
          router.push("/auth/login");
          setUser(null);
          setPassed(false);
        }
      } else {
        toast.error(res.data.message, { id: toastId });
        setUser(null);
        setPassed(false);
      }
    }
  };

  useEffect(() => {
    const savedLockTime = localStorage.getItem("lockTime");
    if (savedLockTime) {
      const timeLeft = new Date(savedLockTime).getTime() - Date.now();
      if (timeLeft > 0) {
        setError(
          "Bro! Too many failed attempts. Session restricted for 15 minutes."
        );
        setIsLocked(true);
        setTimeout(() => {
          setIsLocked(false);
          localStorage.removeItem("lockTime");
        }, timeLeft);
      }
    }
  }, []);

  //end
  return (
    <div>
      <div
        className="min-h-screen flex justify-center px-5 items-center -mt-5 md:-mt-20"
        data-aos="zoom-out"
      >
        <div
          className={`md:h-96 ${
            user ? "md:flex" : "block"
          } justify-between w-full md:w-[${
            user ? "80%" : "40%"
          }] mx-auto py-16 md:py-0 shadow-md rounded-md`}
        >
          {/* search */}
          <div className="flex flex-1 justify-center h-full px-5 md:px-10 flex-col">
            <div className="mb-10">
              <h1 className="text-3xl font-semibold text-gray-700">
                Recover Your Account
              </h1>
              <p className="text-gray-700">
                Sorry to hear that you have forgotten your account information,
                but no problem, we will help you recover it.
              </p>
            </div>
            <form
              className={`${user ? "hidden" : "flex"} items-center`}
              onSubmit={handleFindUser}
            >
              <input
                required
                className="w-full px-4 py-2 border border-rose-600 rounded-l-md focus:outline-none focus:ring-0"
                disabled={isLocked}
                id="Enter Email Address"
                name="email"
                placeholder="Enter Email Address"
                type="email"
              />
              <button
                className={`py-2 px-3 border hover:bg-primary-700 transition-all border-rose-600 bg-primary-500 text-white rounded-r-md`}
                type={isLocked ? "button" : "submit"}
              >
                Search
              </button>
            </form>
            {!passed && <p className="text-sm text-rose-600 ml-1">{error}</p>}
            {!error && !user && (
              <p className="ml-1 text-sm text-gray-400">
                Note: 3 wrong attempts will lock you out for 15 minutes.
              </p>
            )}
          </div>

          {/* profile details */}
          {user && !passed && (
            <div className="flex-1 border-t md:border-t-0" data-aos="zoom-out">
              <button
                className="text-end p-5 text-xl font-semibold cursor-pointer"
                onClick={() => setUser(null)}
              >
                x
              </button>
              <div className=" flex flex-col mt-2 justify-center px-5 md:px-10 items-center border-l">
                {/* name and photo */}
                <div className="flex flex-col justify-center items-center">
                  <Image
                    alt="Profile photo"
                    className="w-24 h-24 rounded-full shadow-lg mb-4"
                    src={demoProfile}
                  />
                  <h3 className="text-xl text-gray-700">{user?.name}</h3>
                  <small>{user?.email}</small>
                </div>
                <div className="mt-7">
                  <button
                    className="py-2 px-3 rounded-md hover:bg-rose-700 transition-all bg-rose-600 text-white"
                    onClick={handleSendVerificationEmail}
                  >
                    Send Verification Code To Email
                  </button>
                </div>
              </div>
            </div>
          )}

          {passed && user && (
            <div className="flex-1 border-t md:border-t-0" data-aos="zoom-out">
              <button
                className="text-end p-5 text-xl font-semibold cursor-pointer"
                onClick={() => {
                  setUser(null);
                  setPassed(false);
                }}
              >
                x
              </button>
              <div className=" flex flex-col mt-2 justify-center px-5 md:px-10 items-center border-l">
                {/* name and photo */}
                <form className="w-full" onSubmit={handleChangePassword}>
                  <h3 className="text-xl ">Welcome Back Bro!</h3>
                  <small className="leading-none">
                    You have recovered everything in your account. We are
                    delighted to be with you on this journey
                  </small>
                  <div className="mb-4 mt-4">
                    <input
                      required
                      className="w-full px-4  py-2 border border-rose-600 rounded-md focus:outline-none focus:ring-0"
                      id="password"
                      name="password"
                      placeholder="New Password"
                      type="password"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      required
                      className="w-full px-4  py-2 border border-rose-600 rounded-md focus:outline-none focus:ring-0"
                      id="password2"
                      name="password2"
                      placeholder="Confirm Password"
                      type="password"
                    />
                    <p className="text-sm text-rose-600 ml-1">{error}</p>
                  </div>
                  <div className="mb-4 flex ">
                    <button
                      className="text-white w-full bg-rose-600 hover:bg-rose-700 py-2 px-5 rounded-md"
                      type="submit"
                    >
                      Change
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* email verification modal */}
      <div className="mx-auto w-fit">
        <div
          className={`fixed z-[100] w-screen ${
            openModal ? "visible opacity-100" : "invisible opacity-0"
          } inset-0 grid place-items-center backdrop-blur-sm duration-100 bg-transparent`}
        >
          <div
            className={`absolute w-full md:w-[40%] rounded-lg bg-white p-6 drop-shadow-lg ${
              openModal
                ? "opacity-1 duration-300"
                : "scale-110 opacity-0 duration-150"
            }`}
            role="button"
            tabIndex={0}
            onClick={(e_) => e_.stopPropagation()}
            onKeyDown={(e_) => {
              if (e_.key === "Enter" || e_.key === " ") {
                e_.preventDefault();
                setOpenModal(false);
              }
            }}
          >
            <svg
              className="absolute right-3 top-3 w-6 cursor-pointer fill-zinc-600"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setOpenModal(false)}
            >
              <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" />
            </svg>
            <h1 className="text-gray-700 mb-2 text-2xl font-semibold">
              Verification Code
            </h1>
            <p className="text-gray-700">
              If you can&apos;t find the email in your inbox, please check your
              spam or junk folder
            </p>
            <div className="mt-8">
              <Input.OTP
                formatter={(str) => str.toUpperCase()}
                size="large"
                style={{ width: "100%" }}
                {...sharedProps}
              />
            </div>
            <p className="text-sm text-rose-600 ml-1">{error}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recover;
