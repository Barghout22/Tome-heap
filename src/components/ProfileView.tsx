import React from "react";
import { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import stockImage from "../image_resources/userDefaultImage.png";

const ProfileView = ({ viewOwnProfile }: { viewOwnProfile: boolean }) => {
  const user = getAuth().currentUser;
  const userImage = user!.photoURL ? user!.photoURL : stockImage;
  const [editState, setEditState] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);

  const uploadUserProfilePic = async (file: File) => {
    const filePath = `${getAuth().currentUser!.uid}/ProfileImage`;
    const newImageRef = ref(getStorage(), filePath);
    const fileSnapshot = await uploadBytesResumable(newImageRef, file);
    const publicImageUrl = await getDownloadURL(newImageRef);
    updateProfile(getAuth().currentUser!, {
      photoURL: publicImageUrl,
    })
      .then(() => {
        setUpdateStatus(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateProfilePic = (e: any) => {
    e.preventDefault();
    uploadUserProfilePic(e.target.files[0]);
  };
  return (
    <>
      {updateStatus && (
        <div className="absolute w-screen	h-screen bg-black bg-opacity-50">
          <div className="absolute top-1/3 left-1/3 bg-white text-black rounded-xl font-Lobster text-3xl p-8 font-bold">
            <p> update successful</p>
            <button
              className="bg-black text-white rounded-full h-11 mt-2 text-2xl font-semibold w-44 transition-all"
              onClick={() => {
                setUpdateStatus(false);
              }}
            >
              ok
            </button>
          </div>
        </div>
      )}
      <h1 className="border-b-2 pt-16 pl-16 bg-gray-800 text-white font-Lobster text-3xl font-bold">
        Profile
      </h1>
      <div className="bg-gray-800 min-h-screen text-white font-Lobster flex pt-14 text-2xl">
        <div className="w-1/3 pl-16">
          <img src={userImage} alt="" className="w-56  h-56 border-2" />
          {viewOwnProfile && (
            <div className="flex flex-col mt-9">
              {" "}
              <label>
                update profile image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={updateProfilePic}
                ></input>
              </label>
            </div>
          )}
        </div>

        <div>
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
