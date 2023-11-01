import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
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
import { async } from "@firebase/util";

const retrieveFriendStatus = async (
  currentUserId: string,
  viewedUserId: string
) => {
  const docRef = doc(
    getFirestore(),
    `user-${currentUserId}-friends`,
    `user-${viewedUserId}`
  );

  const data = await getDoc(docRef);
  return data.data()?.status;
};
const retrieveFriendRequestStatus = async (
  currentUserId: string,
  viewedUserId: string
) => {
  const q = query(collection( getFirestore(),`user-${currentUserId}-friendReqs`), where("userId", "==", viewedUserId));

 let dataCount=0;
 let reqStatus:string|undefined=undefined
  const data = await getDocs(q);
  data.forEach(dataResult=>{
    reqStatus = dataResult.data().status;
dataCount++;  
})
return dataCount>0?reqStatus:undefined;
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
  const [friendStatus, setFriendStatus] = useState<string | undefined>();
  const [friendReqStatus, setFriendReqStatus] = useState<string | undefined>();

  useEffect(() => {
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
      //  await addDoc(collection(getFirestore(), userBookCluster), book);
    } catch (e) {
      console.error(e);
    }
  };
  const addFriend = async () => {
    try {
      await addDoc(
        collection(
          getFirestore(),
          `user-${currentUserId}-friendReqs`),
        { userId: viewedUserId, status: "sent", viewed: true }
      );
      await addDoc(
        collection(
          getFirestore(),
          `user-${viewedUserId}-friendReqs`),
        { userId: currentUserId, status: "received", viewed: false }
      );

      setFriendReqStatus("sent");
    } catch (e) {
      console.error(e);
    }
  };
  const acceptRequest = async () => {
    try {
      // await addDoc(collection(getFirestore(), userBookCluster), book);
    } catch (e) {
      console.error(e);
    }
  };
  const cancelRequest = async () => {
    try {
      //await addDoc(collection(getFirestore(), userBookCluster), book);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    // getAuth().currentUser&&
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
  );
};
export default UserpageInterface;
