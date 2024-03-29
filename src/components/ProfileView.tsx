import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { userDefaultImage } from "../RouteSwitch";
import UserpageInterface from "./userPageInterface";
type User = {
  userID: string;
  username: string;
  profilePicture?: string;
  about?: string;
};
const ProfileView = ({
  viewOwnProfile,
  viewedProfileID,
  setUserID,
}: {
  viewOwnProfile: boolean;
  viewedProfileID: string;
  setUserID: Function;
}) => {
  useEffect(() => {
    const dataDocName = viewOwnProfile
      ? `user-${getAuth().currentUser?.uid}`
      : `user-${viewedProfileID}`;
    const docRef = doc(getFirestore(), "usersData", dataDocName);
    getDoc(docRef).then((userData) => {
      let userPlaceholder = {
        userID: userData.data()!.userID,
        username: userData.data()!.username,
        profilePicture: userData.data()!.profilePicture
          ? userData.data()!.profilePicture
          : userDefaultImage,
        about: userData.data()!.about ? userData.data()!.about : " ",
      };

      setCurrentUser(userPlaceholder);
      setUserAbout(userPlaceholder.about);
      upDateUserAboutPlaceHolder(userPlaceholder.about);
      setUserImage(userPlaceholder.profilePicture);
      setFirstName(userPlaceholder.username.split(" ")[0]);
      setLastName(userPlaceholder.username.split(" ")[1]);
    });
  }, [viewOwnProfile]);
  const [currentUser, setCurrentUser] = useState<User>({
    userID: " ",
    username: " ",
    profilePicture: " ",
    about: " ",
  });
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(" ");
  const [lastName, setLastName] = useState(" ");
  const [userImage, setUserImage] = useState(" ");

  const [editState, setEditState] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [userAbout, setUserAbout] = useState(" ");
  const [userAboutPlaceHolder, upDateUserAboutPlaceHolder] = useState(" ");

  const uploadUserProfilePic = async (file: File) => {
    const filePath = `${getAuth().currentUser!.uid}/ProfileImage`;
    const newImageRef = ref(getStorage(), filePath);
    const fileSnapshot = await uploadBytesResumable(newImageRef, file);
    const publicImageUrl = await getDownloadURL(newImageRef);
    setUserImage(publicImageUrl);
    updateProfile(getAuth().currentUser!, {
      photoURL: publicImageUrl,
    })
      .then(() => {
        window.scrollTo(0, 0);
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

  const updatePersonalInfo = async (about: string, userName?: string) => {
    const dataToBeUpdated: any = {};
    userName ? (dataToBeUpdated["username"] = userName) : null;
    userName
      ? updateProfile(getAuth().currentUser!, { displayName: userName })
      : null;
    about !== " " ? (dataToBeUpdated["about"] = about) : null;
    await setDoc(
      doc(getFirestore(), "usersData", `user-${getAuth().currentUser?.uid}`),
      dataToBeUpdated,
      { merge: true }
    ).then(() => {
      window.scrollTo(0, 0);
      setUpdateStatus(true);
    });
  };

  const updateProfilePic = (e: any) => {
    e.preventDefault();
    uploadUserProfilePic(e.target.files[0]);
  };
  const handleUpdates = (e: any) => {
    e.preventDefault();
    setEditState(false);
    const userName = `${firstName} ${lastName}`;

    if (
      userAboutPlaceHolder !== userAbout &&
      userName !== currentUser.username
    ) {
      updatePersonalInfo(userAboutPlaceHolder, userName);
      setUserAbout(userAboutPlaceHolder);
    } else if (userAboutPlaceHolder !== userAbout) {
      updatePersonalInfo(userAboutPlaceHolder);
      setUserAbout(userAboutPlaceHolder);
    } else if (userName !== currentUser.username) {
      updatePersonalInfo(" ", userName);
      setUserAbout(userAboutPlaceHolder);
    }
  };

  const viewBooks = () => {
    setUserID(`${currentUser.userID}`);
    navigate("/ProfileBookListDisplay");
  };
  const viewReviews = () => {
    setUserID(`${currentUser.userID}`);
    navigate("/reviewsDisplay");
  };
  const sendMessage = () => {
    setUserID(`${currentUser.userID}`);
    navigate("/messages");
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
      <div className="bg-gray-800 min-h-screen text-white font-Lobster flex flex-col pt-14 ">
        <div className="flex flex-col sm:flex-row">
          <div className="w-3/4 mx-12 aspect-square flex flex-col items-center sm:w-1/4 ">
            <img src={userImage} alt="" className="w-full border-2 " />
            {viewOwnProfile && (
              <div className="flex flex-col w-full mt-2">
                {" "}
                <label className="bg-white rounded-full text-2xl font-semibold  text-black transition-all text-center hover:bg-black hover:text-white cursor-pointer">
                  upload new image
                  <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={updateProfilePic}
                  ></input>
                </label>
              </div>
            )}
          </div>
          <div className="mt-12 sm:mt-0 pl-5 w-10/12 sm:w-1/2">
            <h2 className="font-semibold text-3xl ">
              {!editState ? `${firstName} ${lastName}` : null}
            </h2>
            {!editState ? (
              <p className="mt-12 font-semibold text-2xl">about me: </p>
            ) : null}
            {!editState ? <p className="text-2xl">{userAbout}</p> : null}
            {editState && (
              <form
                onSubmit={handleUpdates}
                className="flex flex-col items-center"
              >
                <span className="w-full flex justify-between">
                  <input
                    className="border-2 border-white bg-gray-800 text-white font-Lobster w-5/12 h-12"
                    type="text"
                    placeholder="first name"
                    defaultValue={firstName}
                    required
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    className="border-2 border-white bg-gray-800 text-white font-Lobster w-5/12"
                    type="text"
                    placeholder="last name"
                    defaultValue={lastName}
                    required
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </span>
                <textarea
                  className="border-2 border-white bg-gray-800 text-white font-Lobster w-full mt-8"
                  id="story"
                  name="story"
                  rows={8}
                  cols={33}
                  required
                  onChange={(e) => {
                    upDateUserAboutPlaceHolder(e.target.value);
                  }}
                  defaultValue={userAbout}
                ></textarea>
                <button
                  type="submit"
                  className="bg-white rounded-full h-11 mt-10 text-2xl font-semibold w-44 text-black transition-all hover:bg-black hover:text-white"
                >
                  Save information
                </button>
              </form>
            )}
            {viewOwnProfile && !editState && (
              <button
                className="bg-white rounded-full h-11 mt-14 text-2xl font-semibold w-44 text-black transition-all hover:bg-black hover:text-white"
                onClick={() => setEditState(true)}
              >
                edit information
              </button>
            )}
          </div>
        </div>
        {!viewOwnProfile &&
          currentUser.userID&&(
            <UserpageInterface
              viewedUserId={currentUser.userID}
              viewedUsername={currentUser.username}
              viewedUserProfilePic={currentUser.profilePicture!}
              setUserID={setUserID}
            />
          )}
      </div>
    </>
  );
};

export default ProfileView;
