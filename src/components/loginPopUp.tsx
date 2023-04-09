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
      <div className=" bg-white w-4/12 h-1/2 text-center p-7 relative">
        <button
          className="absolute w-10 top-[-20px] right-[-20px] "
          onClick={() => setLogInStatus("none")}
        >
          <img
            src={ExitBtn}
            alt=""
            className="rounded-full border-gray-500 border-4 border-solid"
          />
        </button>
        <h1>hello</h1>
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
        <button>{status}</button>
      </div>
    </div>
  );
};

export default LogInPopUp;
