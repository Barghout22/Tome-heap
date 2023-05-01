import React from "react";
import { getAuth } from "firebase/auth";
import stockImage from "../image_resources/userDefaultImage.png";

const ProfileView = () => {
  const user = getAuth().currentUser;
  const userImage = user!.photoURL ? user!.photoURL : stockImage;
  return (
    <div className="bg-gray-800 min-h-screen text-white font-Lobster pt-14">
      <img src={userImage} alt="" />
      <h2>{user!.displayName}</h2>
      <h2></h2>
      {/* <textarea name="" id="" cols=30" rows="10"/> */}
    </div>
  );
};

export default ProfileView;
