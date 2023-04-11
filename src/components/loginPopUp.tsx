import React from "react";
import ExitBtn from "../image_resources/exitBtn.webp";

const LogInPopUp = ({
  status,
  setLogInStatus,
}: {
  status: string;
  setLogInStatus: Function;
}) => {
  const signUp = status === "sign up" ? true : false;
  return (
    <div className="absolute w-full h-full flex justify-center bg-black bg-opacity-50 items-center backdrop-blur-sm">
      <div className=" bg-white w-96 h-1/2 text-center p-7 relative flex flex-col justify-evenly items-center">
        <button
          className="absolute w-10 top-[-20px] right-[-20px] "
          onClick={() => setLogInStatus("none")}
        >
          <img
            src={ExitBtn}
            alt=""
            className="rounded-full border-gray-500 border-4 border-solid hover:border-gray-400"
          />
        </button>
        {signUp && (
          <input
            type="text"
            name="userName"
            placeholder="enter your name"
            className="border-gray-500 border-2 border-solid  h-9 focus:outline-none focus:ring focus:ring-blue-600"
          />
        )}
        <input
          type="text"
          name="email"
          placeholder="enter your e-mail"
          className="border-gray-500 border-2 border-solid h-9 focus:outline-none focus:ring focus:ring-blue-600"
        />
        <input
          type="password"
          name="psswrd"
          placeholder=" enter your password"
          className="border-gray-500 border-2 border-solid h-9 focus:outline-none focus:ring focus:ring-blue-600"
        />
        {signUp && (
          <p>
            Already have an account?
            <span
              className="hover:underline cursor-pointer underline-offset-2"
              onClick={() => setLogInStatus("log in")}
            >
              log in
            </span>
          </p>
        )}
        {!signUp && (
          <p>
            new here?
            <span
              className="hover:underline cursor-pointer underline-offset-2"
              onClick={() => setLogInStatus("sign up")}
            >
              Sign up
            </span>
          </p>
        )}
        <button className="bg-black text-white w-10/12 h-9 hover:bg-gray-800">
          {status}
        </button>
      </div>
    </div>
  );
};

export default LogInPopUp;
