import React from "react";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import stockImage from "../image_resources/userDefaultImage.png";

const ProfileView = ({ viewOwnProfile }: { viewOwnProfile: boolean }) => {
  const user = getAuth().currentUser;
  const userImage = user!.photoURL ? user!.photoURL : stockImage;
  const [editState, setEditState] = useState(false);
  return (
    <>
      <h1 className="border-b-2 pt-16 pl-16 bg-gray-800 text-white font-Lobster text-3xl font-bold">
        Profile
      </h1>
      <div className="bg-gray-800 min-h-screen text-white font-Lobster flex pt-14 text-2xl">
        <div>
          <img src={userImage} alt="" className="w-56  h-56 border-2" />
          {viewOwnProfile && (
            <button className="bg-white rounded-full h-11 mt-4 ml-5 text-2xl font-semibold w-44 text-black transition-all hover:bg-black hover:text-white">
              change image
            </button>
          )}
        </div>

        <div className="pl-16">
          <h2>username:{user!.displayName}</h2>
          <p>about:</p>
          {/* <textarea name="" id="" cols=30" rows="10"/> */}
          {viewOwnProfile && !editState && (
            <button
              className="bg-white rounded-full h-11 mt-14 text-2xl font-semibold w-44 text-black transition-all hover:bg-black hover:text-white"
              onClick={() => setEditState(true)}
            >
              edit information
            </button>
          )}
          {viewOwnProfile && editState && (
            <button
              className="bg-white rounded-full h-11 mt-14 text-2xl font-semibold w-44 text-black transition-all hover:bg-black hover:text-white"
              onClick={() => setEditState(false)}
            >
              Save information
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileView;
