import React from "react";
import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import stockImage from "../image_resources/userDefaultImage.png";

const ProfileView = ({
  viewOwnProfile,
  viewedProfileID,
}: {
  viewOwnProfile: boolean;
  viewedProfileID: string;
}) => {
  useEffect(() => {
    const docRef = doc(
      getFirestore(),
      "usersAbout",
      `user-${getAuth().currentUser?.uid}`
    );
    getDoc(docRef).then((about) => {
      if (about.data()) {
        setUserAbout(about.data()!.about);
      }
    });
  }, []);
  const user = getAuth().currentUser;
  const userImage = user!.photoURL ? user!.photoURL : stockImage;
  const [editState, setEditState] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [userAbout, setUserAbout] = useState(" ");
  const [userAboutPlaceHolder, upDateUserAboutPlaceHolder] = useState(" ");

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
        setDoc(
          doc(
            getFirestore(),
            "usersData",
            `user-${getAuth().currentUser?.uid}`
          ),
          { profilePicture: publicImageUrl },
          { merge: true }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updatePersonalInfo = async (about: string) => {
    await setDoc(
      doc(getFirestore(), "usersData", `user-${getAuth().currentUser?.uid}`),
      { username: `${getAuth().currentUser?.displayName}`, about: about },
      { merge: true }
    );
  };

  const updateProfilePic = (e: any) => {
    e.preventDefault();
    uploadUserProfilePic(e.target.files[0]);
  };
  const handleUpdates = () => {
    setEditState(false);
    if (userAboutPlaceHolder !== " " && userAboutPlaceHolder !== userAbout) {
      updatePersonalInfo(userAboutPlaceHolder);
      setUserAbout(userAboutPlaceHolder);
    }
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
          <p>about: {!editState ? userAbout : null}</p>
          {editState && (
            <textarea
              className="border-2 border-white bg-gray-800 text-white font-Lobster"
              id="story"
              name="story"
              rows={5}
              cols={33}
              onChange={(e) => {
                upDateUserAboutPlaceHolder(e.target.value);
              }}
              defaultValue={userAbout}
            ></textarea>
          )}
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
              onClick={handleUpdates}
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
