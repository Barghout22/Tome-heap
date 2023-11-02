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

const getUsers = async (currentUserId: string, viewedUserId: string) => {
  try {
    const currentUser = await getDoc(
      doc(getFirestore(), "usersData", `user-${currentUserId}`)
    );
    const viewedUser = await getDoc(
      doc(getFirestore(), "usersData", `user-${viewedUserId}`)
    );
    return [currentUser.data(), viewedUser.data()];
  } catch (error) {
    console.error(error);
  }
};

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
  username,
  setUserID,
}: {
  viewedUserId: string;
  username: string;
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
    username: " ",
    photoUrl: " ",
    userId: viewedUserId,
  });

  useEffect(() => {
    getUsers(currentUserId!, viewedUserId).then((userData) => {
      setCurrentUser({
        username: userData![0]?.username,
        photoUrl: userData![0]?.profilePicture
          ? userData![0].profilePicture
          : userDefaultImage,
        viewedUserId: currentUserId,
      });
      setViewedUser({
        username: userData![1]?.username,
        photoUrl: userData![1]?.profilePicture
          ? userData![1].profilePicture
          : userDefaultImage,
        userId: viewedUserId,
      });
    });
    retrieveFriendStatus(currentUserId!, viewedUserId).then((friendStatus) => {
      setFriendStatus(friendStatus);
      if (!friendStatus) {
        retrieveFriendRequestStatus(currentUserId!, viewedUserId).then(
          (friendReqStatus) => setFriendReqStatus(friendReqStatus)
        );
      }
    });
  });

  const viewBooks = () => {
    navigate("/ProfileBookListDisplay");
  };
  const viewReviews = () => {
    setUserID(`${viewedUserId}`);
    navigate("/reviewsDisplay");
  };
  const sendMessage = () => {
    setUserID(`${viewedUserId}`);
    navigate("/messages");
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
          username: viewedUser.username,
          profilePicture: viewedUser.photoUrl,
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
          username: viewedUser.username,
          profilePicture: viewedUser.photoUrl,
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
          profilePicture: currentUser.photoUrl,
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
              {username.split(" ")[0]}'s books
            </p>
            <p
              className="text-black rounded-full  mt-4 text-3xl font-semibold w-52 mb-8 mx-2 text-center bg-white transition-all hover:text-white hover:bg-black cursor-pointer "
              onClick={viewReviews}
            >
              {username.split(" ")[0]}'s book reviews
            </p>
            <p
              className="text-black rounded-full mt-4 text-3xl font-semibold w-52 mb-8 mx-2 text-center bg-white transition-all hover:text-white hover:bg-black cursor-pointer "
              onClick={sendMessage}
            >
              message {username.split(" ")[0]}
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
