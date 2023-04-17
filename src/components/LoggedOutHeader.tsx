import React from "react";
import icon from "../image_resources/tome-heap-logo_thumbnail.ico";

const LoggedOutHeader = ({ setLogInStatus }: { setLogInStatus: Function }) => {
  return (
    <div className="text-white absolute top-0 w-screen flex justify-between">
      <div className="flex">
        <img src={icon} className="rounded-full  w-9 h-9 ml-2 my-2" alt="" />
        <h2 className="my-3 text-3xl font-Pacifico">tH</h2>
      </div>

      <ul className="flex justify-around my-3">
        <li
          className="mx-4 hover:underline cursor-pointer underline-offset-2 font-Lobster"
          onClick={() => setLogInStatus("sign up")}
        >
          sign up
        </li>
        <li
          className="mx-9 hover:underline cursor-pointer underline-offset-2 font-Lobster"
          onClick={() => setLogInStatus("log in")}
        >
          log in
        </li>
      </ul>
    </div>
  );
};
export default LoggedOutHeader;
