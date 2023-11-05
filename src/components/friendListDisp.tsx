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

const FriendListDisp = ({
  setViewOwnProfile,
  setViewedProfileID,
}: {
  setViewOwnProfile: Function;
  setViewedProfileID: Function;
}) => {
  const navigate = useNavigate();
  const [friendList, setFriendList] = useState([
    {
      username: " ",
      profilePicture: " ",
      userId: " ",
    },
  ]);
  const currentUserId = getAuth().currentUser?.uid;

  useEffect(() => {
    getDocs(collection(getFirestore(), `user-${currentUserId}-friends`)).then(
      (results) => {
        let PlaceHolderArr: {
          username: string;
          profilePicture: string;
          userId: string;
        }[] = [];
        results.forEach((result) => {
          PlaceHolderArr.push({
            username: result.data().username,
            profilePicture: result.data().profilePicture,
            userId: result.data().otherUserId,
          });
        });
        if (PlaceHolderArr.length > 0) {
          PlaceHolderArr.sort(function(a,b){
            return Number(a.username) - Number(b.username);
          })
          setFriendList(PlaceHolderArr);
        }
      }
    );
  }, []);
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
      {friendList && friendList.length > 0 && (
        <div className="flex flex-col justify-around">
          <p className="text-3xl ml-2 underline">my friends:</p>
          {friendList.map((friend) => (
            <div key={friend.userId} className="flex ml-4 mt-4">
              <img
                src={friend.profilePicture}
                alt=""
                className="w-14 h-14 rounded-full"
              />
              <p
                className=" 
                text-2xl
                font-bold
                hover:underline
                hover:cursor-pointer
                ml-2
              "
                onClick={() => goToProfile(friend.userId)}
              >
                {friend.username}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default FriendListDisp;
