import React from "react";
import icon from "../image_resources/tome-heap-logo_thumbnail.ico";
import userThumbnail from "../image_resources/userDefaultImage.png";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const LoggedInHeader = ({
  setUserSignInStatus,
}: {
  setUserSignInStatus: Function;
}) => {
  function signOutUser() {
    // Sign out of Firebase.
    signOut(getAuth());
    setUserSignInStatus(false);
  }
  const userImg = getAuth().currentUser?.photoURL || userThumbnail;
  const usrFrtNm = getAuth().currentUser?.displayName!.split(" ")[0];
  return (
    <div className="text-white absolute top-0 w-screen flex justify-between">
      <div className="flex">
        <img src={icon} className="rounded-full  w-9 h-9 ml-2 my-2" alt="" />
        <h2 className="my-3 text-3xl font-Pacifico">tH</h2>
      </div>

      <ul className="flex justify-around my-3">
        <li className="mx-4 hover:underline cursor-pointer underline-offset-2 font-Lobster">
          {usrFrtNm}
        </li>
        <li>
          <img src={userImg} alt="" className="w-11 h-11 rounded-full" />
        </li>
        <li
          className="mx-9 hover:underline cursor-pointer underline-offset-2 font-Lobster"
          onClick={() => signOutUser()}
        >
          sign out
        </li>
      </ul>
    </div>
  );
};
export default LoggedInHeader;
