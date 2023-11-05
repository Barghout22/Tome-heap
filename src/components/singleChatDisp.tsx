import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  where,
  Timestamp,
} from "firebase/firestore";
import { userDefaultImage } from "../RouteSwitch";
import { async } from "@firebase/util";
interface message {
  username: string;
  otherUserId: string;
  otherUserProfilePic: string;
  messageBody: string;
  timestamp: string;
  messageStatus: string;
  read: boolean;
}
import uniqid from "uniqid";
import { Navigate } from "react-router-dom";

const SingleChatDisp = ({ userID }: { userID: string }) => {
  const navigate = useNavigate();
  const viewedUserId = userID;
  const CurrentUserId = getAuth().currentUser?.uid;
  const [viewedUser, setViewedUser] = useState({
    username: " ",
    profilePic: " ",
  });
  const [currentUser, setCurrentUser] = useState({
    username: " ",
    profilePic: " ",
  });
  const [userMessages, setUserMessages] = useState<message[] | undefined>();
  const [draftMessage, setDraftMessage] = useState(" ");
  const [textAreaVal, setTextAreaVal] = useState("");
  const bottomRef = useRef<null | HTMLFormElement>(null);
  useEffect(() => {
    getDoc(doc(getFirestore(), "usersData", `user-${viewedUserId}`)).then(
      (returnVal) => {
        setViewedUser({
          username: returnVal.data()!.username,
          profilePic: returnVal.data()!.profilePicture,
        });
      }
    );
    getDoc(doc(getFirestore(), "usersData", `user-${CurrentUserId}`)).then(
      (returnVal) => {
        setCurrentUser({
          username: returnVal.data()!.username,
          profilePic: returnVal.data()!.profilePicture,
        });
      }
    );
    getDocs(
      query(
        collection(
          getFirestore(),
          `user-${getAuth().currentUser?.uid}-messages`
        ),
        where("otherUserId", "==", viewedUserId)
      )
    ).then((results) => {
      if (results.docs.length > 0) {
        let placeHolderArr: message[] = [];
        results.docs.forEach((result) => {
          let timestring = result.data().timestamp.seconds
            ? result.data().timestamp.seconds * 1000 +
              result.data().timestamp.nanoseconds / 1000000
            : result.data().timestamp.nanoseconds / 1000000;
          placeHolderArr.push({
            username: result.data().username,
            otherUserId: result.data().otherUserId,
            otherUserProfilePic: result.data().otherUserProfilePic,
            messageBody: result.data().messageBody,
            timestamp: new Date(timestring).toLocaleString(),
            messageStatus: result.data().messageStatus,
            read: true,
          });
          getDocs(
            query(
              collection(
                getFirestore(),
                `user-${getAuth().currentUser?.uid}-messages`
              ),

              where("read", "==", false),
              where("otherUserId", "==", viewedUserId)
            )
          ).then((results) =>
            results.forEach((result) => {
              setDoc(
                doc(
                  getFirestore(),
                  `user-${getAuth().currentUser?.uid}-messages`,
                  result.id
                ),
                { read: true },
                { merge: true }
              );
            })
          );
        });

        placeHolderArr.sort(function (a, b) {
          let timestampA = new Date(a.timestamp).valueOf();
          let timestampB = new Date(b.timestamp).valueOf();
          return timestampA - timestampB;
        });
        setUserMessages(placeHolderArr);
        
      }
    });
  }, []);
  useEffect(()=>{
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  },[userMessages])

  const saveDraftMsg = (e: any) => {
    setDraftMessage(e.target.value);
    setTextAreaVal(e.target.value);
  };
  const saveNewMsg = async (e: any) => {
    e.preventDefault();
    setDraftMessage("");
    setTextAreaVal("");
    let messagePlaceHolder = userMessages;
    if (messagePlaceHolder) {
      messagePlaceHolder.push({
        username: viewedUser.username,
        otherUserId: viewedUserId,
        otherUserProfilePic: viewedUser.profilePic
          ? viewedUser.profilePic
          : userDefaultImage,
        messageBody: draftMessage,
        timestamp: new Date().toLocaleString(),
        messageStatus: "sent",
        read: true,
      });
    } else {
      messagePlaceHolder = [
        {
          username: viewedUser.username,
          otherUserId: viewedUserId,
          otherUserProfilePic: viewedUser.profilePic
            ? viewedUser.profilePic
            : userDefaultImage,
          messageBody: draftMessage,
          timestamp: new Date().toLocaleString(),
          messageStatus: "sent",
          read: true,
        },
      ];
    }

    setUserMessages(messagePlaceHolder);
    await addDoc(collection(getFirestore(), `user-${CurrentUserId}-messages`), {
      username: viewedUser.username,
      otherUserId: viewedUserId,
      otherUserProfilePic: viewedUser.profilePic
        ? viewedUser.profilePic
        : userDefaultImage,
      messageBody: draftMessage,
      timestamp: serverTimestamp(),
      messageStatus: "sent",
      read: true,
    });
    await addDoc(collection(getFirestore(), `user-${viewedUserId}-messages`), {
      username: currentUser.username,
      otherUserId: CurrentUserId,
      otherUserProfilePic: currentUser.profilePic
        ? currentUser.profilePic
        : userDefaultImage,
      messageBody: draftMessage,
      timestamp: serverTimestamp(),
      messageStatus: "received",
      read: false,
    });
  };
  const goToAllMessages = () => {
    navigate("/messages");
  };
  return (
    <div className="bg-gray-800 min-h-screen text-white font-Lobster flex flex-col pt-14 relative ">
      <p
        className="bg-gray-800 p-4 text-2xl hover:underline hover:cursor-pointer shadow-xl fixed w-screen top-0"
        onClick={goToAllMessages}
      >
        go back to all messages
      </p>
      {userMessages && userMessages.length > 0 && (
        <div className="flex flex-col justify-around">
          {userMessages.map((message) =>
            message.messageStatus === "received" ? (
              <div
                key={uniqid()}
                className="bg-gray-300 text-black w-1/2 rounded-md self-start m-12 p-3"
              >
                <span>
                  <img
                    src={message.otherUserProfilePic}
                    alt=""
                    className="w-11 h-11 rounded-full"
                  />
                  <p className="font-bold text-xl">{message.username}</p>
                </span>
                <p className="text-2xl">{message.messageBody}</p>
                <p>{message.timestamp}</p>
              </div>
            ) : (
              <div
                key={uniqid()}
                className="bg-white text-black w-1/2 rounded-md self-end m-12 p-3"
              >
                <p className="text-2xl">{message.messageBody}</p>
                <p>{message.timestamp}</p>
              </div>
            )
          )}
        </div>
      )}
      <form
        onSubmit={saveNewMsg}
        className="m-12 flex flex-col"
        ref={bottomRef}
      >
        <textarea
          className="bg-gray-800 border-gray-200 border-solid border-2 w-11/12 focus:cursor-text focus:border-3"
          name="new_msg"
          id="new_msg"
          cols={30}
          rows={10}
          value={textAreaVal}
          placeholder="new message"
          required
          onChange={saveDraftMsg}
        ></textarea>
        <button
          type="submit"
          className="text-black rounded-full  mt-4 text-3xl font-semibold w-52 mb-8 mx-2 text-center bg-white transition-all hover:text-white hover:bg-black cursor-pointer self-center"
        >
          send
        </button>
      </form>
    </div>
  );
};
export default SingleChatDisp;
