import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getFirestore,
  getDoc,
  query,
  where,
} from "firebase/firestore";

interface FriendReq {
  username: string;
  userId: string;
  profilePicture: string;
  status: string;
}
import { userDefaultImage } from "../RouteSwitch";

const FriendRequestDisp = ({
  setViewOwnProfile,
  setViewedProfileID,
  setNewFriendReqs,
}: {
  setViewOwnProfile: Function;
  setViewedProfileID: Function;
  setNewFriendReqs: Function;
}) => {
  const navigate = useNavigate();
  const [friendReqs, setFriendReqs] = useState<FriendReq[]>();
  const currentUserId = getAuth().currentUser?.uid;
  const [currentUser, setCurrentUser] = useState({
    username: " ",
    profilePicture: " ",
  });
  useEffect(() => {
    setNewFriendReqs(0);
    getDocs(
      collection(getFirestore(), `user-${currentUserId}-friendReqs`)
    ).then((results) => {
      let PlaceHolderArr: FriendReq[] = [];
      results.forEach((result) => {
        PlaceHolderArr.push({
          username: result.data().username,
          userId: result.data().otherUserId,
          profilePicture: result.data().profilePicture,
          status: result.data().status,
        });
      });
      if (PlaceHolderArr.length > 0) {
        setFriendReqs(PlaceHolderArr);
      }
    });
    getDoc(doc(getFirestore(), "usersData", `user-${currentUserId}`)).then(
      (result) => {
        setCurrentUser({
          username: result.data()!.username,
          profilePicture: result.data()!.profilePicture,
        });
      }
    );
    getDocs(
      query(
        collection(
          getFirestore(),
          `user-${getAuth().currentUser?.uid}-friendReqs`
        ),

        where("viewed", "==", false)
      )
    ).then((results) =>
      results.forEach((result) => {
        setDoc(
          doc(
            getFirestore(),
            `user-${getAuth().currentUser?.uid}-friendReqs`,
            result.id
          ),
          { viewed: true },
          { merge: true }
        );
      })
    );
  }, []);
  const acceptRequest = async (
    otherUserId: string,
    otherUsername: string,
    otherUserProfilePic: string
  ) => {
    try {
      await setDoc(
        doc(
          getFirestore(),
          `user-${currentUserId}-friends`,
          `user-${otherUserId}`
        ),
        {
          username: otherUsername,
          otherUserId: otherUserId,
          profilePicture: otherUserProfilePic
            ? otherUserProfilePic
            : userDefaultImage,
          timeStamp: new Date().toLocaleString(),
        }
      );
      await setDoc(
        doc(
          getFirestore(),
          `user-${otherUserId}-friends`,
          `user-${currentUserId}`
        ),
        {
          username: currentUser.username,
          otherUserId: currentUserId,
          profilePicture: currentUser.profilePicture
            ? currentUser.profilePicture
            : userDefaultImage,
          timeStamp: new Date().toLocaleString(),
        }
      );
      await cancelRequest(otherUserId);
    } catch (e) {
      console.error(e);
    }
  };
  const cancelRequest = async (otherUserId: string) => {
    const updatedFriendReqs = friendReqs?.filter(
      (request) => request.userId !== otherUserId
    );
    setFriendReqs(updatedFriendReqs);

    try {
      await deleteDoc(
        doc(
          getFirestore(),
          `user-${currentUserId}-friendReqs`,
          `user-${otherUserId}`
        )
      );
      await deleteDoc(
        doc(
          getFirestore(),
          `user-${otherUserId}-friendReqs`,
          `user-${currentUserId}`
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const goToProfile = (userId: string) => {
    if (getAuth().currentUser?.uid === userId) {
      setViewOwnProfile(true);
      setViewedProfileID("none");
    } else {
      setViewOwnProfile(false);
      setViewedProfileID(userId);
    }

    navigate("/profile");
  };
  return (
    <div className="bg-gray-800 min-h-screen text-white font-Lobster flex flex-col pt-14 ">
      {friendReqs && friendReqs.length > 0 && (
        <div className="flex flex-col justify-around">
          {friendReqs.map((request) => (
            <div key={request.userId}>
              <img
                src={request.profilePicture}
                alt=""
                className="w-14 h-14 rounded-full"
              />
              <p
                className=" 
                text-3xl
                font-bold
                hover:underline
                hover:cursor-pointer
              "
                onClick={() => goToProfile(request.userId)}
              >
                {request.username}
              </p>
              {request.status === "sent" ? (
                <button
                  onClick={() => cancelRequest(request.userId)}
                  className="text-black rounded-full mt-4 text-xl font-semibold w-48 mb-8 mx-2 text-center bg-white transition-all hover:text-white hover:bg-black cursor-pointer "
                >
                  cancel request
                </button>
              ) : (
                <div className="flex">
                  <button
                    onClick={() =>
                      acceptRequest(
                        request.userId,
                        request.username,
                        request.profilePicture
                      )
                    }
                    className="text-black rounded-full mt-4 text-xl font-semibold w-48 mb-8 mx-2 text-center bg-white transition-all hover:text-white hover:bg-black cursor-pointer "
                  >
                    accept request{" "}
                  </button>
                  <button
                    onClick={() => cancelRequest(request.userId)}
                    className="text-black rounded-full mt-4 text-xl font-semibold w-48 mb-8 mx-2 text-center bg-white transition-all hover:text-white hover:bg-black cursor-pointer "
                  >
                    reject request
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {(!friendReqs || friendReqs.length < 1) && <p>no friend requests</p>}
    </div>
  );
};
export default FriendRequestDisp;
