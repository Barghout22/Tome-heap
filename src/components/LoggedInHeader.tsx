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

const LoggedInHeader = () => {
  function signOutUser() {
    // Sign out of Firebase.
    signOut(getAuth());
  }
  return (
    <div className="text-white absolute top-0 w-screen flex justify-between">
      <div className="flex">
        <img src={icon} className="rounded-full  w-9 h-9 ml-2 my-2" alt="" />
        <h2 className="my-3 text-3xl font-Pacifico">tH</h2>
      </div>

      <ul className="flex justify-around my-3">
        <li className="mx-4 hover:underline cursor-pointer underline-offset-2 font-Lobster">
          {getAuth().currentUser?.displayName}
        </li>
        <li className="rounded w-20 h-20 bg-[url(`${getAuth().currentUser?.photoURL || userThumbnail}`)]">
          <img
            src={getAuth().currentUser?.photoURL || userThumbnail}
            alt=""
            className="w-20 h-20 rounded"
          />
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
