import React from "react";
import icon from "../image_resources/tome-heap-logo_thumbnail.ico";
import arrow from "../image_resources/arrowDownIcon.png";
import { userDefaultImage } from "../RouteSwitch";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import RouteSwitch from "../RouteSwitch";

const LoggedInHeader = ({
  setUserSignInStatus,
  switchDispUserValue,
  newFriendReqs,
  unreadMessages,
}: {
  setUserSignInStatus: Function;
  switchDispUserValue: Function;
  newFriendReqs: number;
  unreadMessages:number;
}) => {

  const navigate = useNavigate();
  const userImg = getAuth().currentUser?.photoURL || userDefaultImage;
  const usrFrstNm = getAuth().currentUser?.displayName!.split(" ")[0];
  return (
    <div className="text-white absolute top-0 w-screen flex justify-between">
      <div className="flex">
        <img src={icon} className="rounded-full  w-9 h-9 ml-2 my-2" alt="" />

        <h2
          className="my-3 text-3xl font-Pacifico cursor-pointer hover:underline"
          onClick={() => {
            navigate("/");
          }}
        >
          tH
        </h2>
      </div>

      <ul
        className=" w-52 mr-10 flex justify-around my-3 bg-white bg-opacity-0 hover:bg-opacity-25 rounded-lg cursor-pointer"
        onClick={() => switchDispUserValue()}
      >
        <li className="mx-4 font-Lobster">{usrFrstNm}</li>
        <li className="relative">
          <img src={userImg} alt="" className="w-11 h-11 rounded-full" />
          {newFriendReqs + unreadMessages > 0 ? (
            <p className=" absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 text-center">
              {newFriendReqs + unreadMessages < 9
                ? `${newFriendReqs + unreadMessages}`
                :"9+"}
            </p>
          ) : null}
        </li>
        <li>
          <img src={arrow} alt="" className="w-4 m-4 mt-2" />
        </li>
      </ul>
    </div>
  );
};
export default LoggedInHeader;
