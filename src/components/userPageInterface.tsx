import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  setDoc,
  getDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { userDefaultImage } from "../RouteSwitch";


const retrieveFriendStatus = async (
  currentUserId: string,
  viewedUserId: string
) => {
  const docRef = doc(
    getFirestore(),
    `user-${currentUserId}-friends`,
    `user-${viewedUserId}`
  );

  const document = await getDoc(docRef);
  if (document.exists()) {
    return true;
  } else return undefined;
};
const retrieveFriendRequestStatus = async (
  currentUserId: string,
  viewedUserId: string
) => {
  const docRef = doc(
    getFirestore(),
    `user-${currentUserId}-friendReqs`,
    `user-${viewedUserId}`
  );
  const document = await getDoc(docRef);
  if (document.exists()) {
    return document.data().status;
  } else {
    return undefined;
  }
};

const UserpageInterface = ({
  viewedUserId,
  viewedUsername,
  viewedUserProfilePic,
  setUserID,
}: {
  viewedUserId:string;
  viewedUsername:string;
  viewedUserProfilePic:string;
  setUserID: Function;
}) => {
  const currentUserId = getAuth().currentUser?.uid;
  const navigate = useNavigate();
  const [friendStatus, setFriendStatus] = useState<boolean | undefined>();
  const [friendReqStatus, setFriendReqStatus] = useState<string | undefined>();
  const [currentUser, setCurrentUser] = useState({
    username: " ",
    photoUrl: " ",
    viewedUserId: currentUserId,
  });
  const [viewedUser, setViewedUser] = useState({
    username: viewedUsername,
    photoUrl: viewedUserProfilePic,
    userId: viewedUserId,
  });

  useEffect(() => {
    setViewedUser({
      username: viewedUsername,
      photoUrl: viewedUserProfilePic,
      userId: viewedUserId,
    });
    getDoc(doc(getFirestore(), "usersData", `user-${currentUserId}`)).then(
      (user) => {
        setCurrentUser({
          username: user.data()?.username,
          photoUrl: user.data()?.profilePicture
            ? user.data()?.profilePicture
            : userDefaultImage,
          viewedUserId: currentUserId,
        });
      }
    );

    retrieveFriendStatus(currentUserId!, viewedUserId).then((friendStatus) => {
      setFriendStatus(friendStatus);
      if (!friendStatus) {
        retrieveFriendRequestStatus(currentUserId!, viewedUserId).then(
          (friendReqStatus) => setFriendReqStatus(friendReqStatus)
        );
      }
    });
  }, []);

  const viewBooks = () => {
    setUserID(`${viewedUserId}`);
    navigate("/ProfileBookListDisplay");
  };
  const viewReviews = () => {
    setUserID(`${viewedUserId}`);
    navigate("/reviewsDisplay");
  };
  const sendMessage = () => {
    setUserID(`${viewedUserId}`);
    navigate("/userChat");
  };
  const removeFriend = async () => {
    try {
      await deleteDoc(
        doc(
          getFirestore(),
          `user-${currentUserId}-friends`,
          `user-${viewedUserId}`
        )
      );
      await deleteDoc(
        doc(
          getFirestore(),
          `user-${viewedUserId}-friends`,
          `user-${currentUserId}`
        )
      );
      setFriendStatus(undefined);
    } catch (e) {
      console.error(e);
    }
  };
  const addFriend = async () => {
    try {
      await setDoc(
        doc(
          getFirestore(),
          `user-${currentUserId}-friendReqs`,
          `user-${viewedUserId}`
        ),
        {
          username: viewedUsername,
          otherUserId: viewedUserId,
          profilePicture: viewedUserProfilePic,
          status: "sent",
          viewed: true,
        }
      );
      await setDoc(
        doc(
          getFirestore(),
          `user-${viewedUserId}-friendReqs`,
          `user-${currentUserId}`
        ),
        {
          username: currentUser.username,
          otherUserId: currentUserId,
          profilePicture: currentUser.photoUrl,
          status: "received",
          viewed: false,
        }
      );

      setFriendReqStatus("sent");
    } catch (e) {
      console.error(e);
    }
  };
  const acceptRequest = async () => {
    try {
      await setDoc(
        doc(
          getFirestore(),
          `user-${currentUserId}-friends`,
          `user-${viewedUserId}`
        ),
        {
          username: viewedUsername,
          otherUserId: viewedUserId,
          profilePicture: viewedUserProfilePic
            ? viewedUserProfilePic
            : userDefaultImage,
          timeStamp: new Date().toLocaleString(),
        }
      );
      await setDoc(
        doc(
          getFirestore(),
          `user-${viewedUserId}-friends`,
          `user-${currentUserId}`
        ),
        {
          username: currentUser.username,
          otherUserId: currentUserId,
          profilePicture: currentUser.photoUrl
            ? currentUser.photoUrl
            : userDefaultImage,
          timeStamp: new Date().toLocaleString(),
        }
      );
      setFriendStatus(true);
      cancelRequest();
    } catch (e) {
      console.error(e);
    }
  };
  const cancelRequest = async () => {
    try {
      await deleteDoc(
        doc(
          getFirestore(),
          `user-${currentUserId}-friendReqs`,
          `user-${viewedUserId}`
        )
      );
      await deleteDoc(
        doc(
          getFirestore(),
          `user-${viewedUserId}-friendReqs`,
          `user-${currentUserId}`
        )
      );
      setFriendReqStatus(undefined);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    getAuth().currentUser && (
      <>
        {friendStatus && (
          <div className="bg-gray-800 flex sm:flex-row justify-start items-center mt-9 flex-col">
            <p
              className="text-black rounded-full mt-4 text-3xl font-semibold w-52 mb-8 mx-2 text-center bg-white transition-all hover:text-white hover:bg-black cursor-pointer "
              onClick={viewBooks}
            >
              {viewedUser.username.split(" ")[0]}'s books
            </p>
            <p
              className="text-black rounded-full  mt-4 text-3xl font-semibold w-52 mb-8 mx-2 text-center bg-white transition-all hover:text-white hover:bg-black cursor-pointer "
              onClick={viewReviews}
            >
              {viewedUser.username.split(" ")[0]}'s reviews
            </p>
            <p
              className="text-black rounded-full mt-4 text-3xl font-semibold w-52 mb-8 mx-2 text-center bg-white transition-all hover:text-white hover:bg-black cursor-pointer "
              onClick={sendMessage}
            >
              message {viewedUser.username.split(" ")[0]}
            </p>
            <p
              className="text-black rounded-full mt-4 text-3xl font-semibold w-52 mb-8 mx-2 text-center bg-white transition-all hover:text-white hover:bg-black cursor-pointer "
              onClick={removeFriend}
            >
              remove friend
            </p>
          </div>
        )}
        {!friendStatus && friendReqStatus === "received" && (
          <div className="bg-gray-800 flex sm:flex-row justify-start items-center mt-9 flex-col">
            <p
              className="text-black rounded-full mt-4 text-3xl font-semibold w-52 mb-8 mx-2 text-center bg-white transition-all hover:text-white hover:bg-black cursor-pointer "
              onClick={acceptRequest}
            >
              accept friend request
            </p>
            <p
              className="text-black rounded-full mt-4 text-3xl font-semibold w-52 mb-8 mx-2 text-center bg-white transition-all hover:text-white hover:bg-black cursor-pointer "
              onClick={cancelRequest}
            >
              reject friend request
            </p>
          </div>
        )}
        {!friendStatus && friendReqStatus === "sent" && (
          <div className="bg-gray-800 flex sm:flex-row justify-center items-center mt-9 flex-col">
            <p
              className="text-black rounded-full mt-4 text-3xl font-semibold w-52 mb-8 mx-2 text-center bg-white transition-all hover:text-white hover:bg-black cursor-pointer "
              onClick={cancelRequest}
            >
              cancel friend request
            </p>
          </div>
        )}
        {!friendStatus && !friendReqStatus && (
          <div className="bg-gray-800 flex sm:flex-row justify-center items-center mt-9 flex-col">
            <p
              className="text-black rounded-full mt-4 text-3xl font-semibold w-52 mb-8 mx-2 text-center bg-white transition-all hover:text-white hover:bg-black cursor-pointer "
              onClick={addFriend}
            >
              add friend
            </p>
          </div>
        )}
      </>
    )
  );
};
export default UserpageInterface;
