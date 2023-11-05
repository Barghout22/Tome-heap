import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  getDoc,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userDefaultImage } from "../RouteSwitch";

interface message {
  messageBody: string;
  messageStatus: string;
  otherUserId: string;
  otherUserProfilePicture: string;
  read: Boolean;
  timestamp: string;
  username: string;
}
const MessagesDisp = ({setUserID}:{setUserID:Function}) => {
  const navigate=useNavigate()
  const currentUserId = getAuth().currentUser?.uid;
  const [messages, setMessages] = useState<message[] | undefined>();
  useEffect(() => {
    let placeHolderArr: message[] = [];
    getDocs(collection(getFirestore(), `user-${currentUserId}-messages`)).then(
      (messages) => {
        messages.forEach((message) => {
          let timestring = message.data().timestamp.seconds
            ? message.data().timestamp.seconds * 1000 +
              message.data().timestamp.nanoseconds / 1000000
            : message.data().timestamp.nanoseconds / 1000000;
          placeHolderArr.push({
            messageBody: message.data().messageBody,
            messageStatus: message.data().messageStatus,
            otherUserId: message.data().otherUserId,
            otherUserProfilePicture: message.data().otherUserProfilePic,
            read: message.data().read,
            timestamp: new Date(timestring).toLocaleString(),
            username: message.data().username,
          });

          placeHolderArr.sort(function (a, b) {
            let timestampA = new Date(a.timestamp).valueOf();
            let timestampB = new Date(b.timestamp).valueOf();
            return timestampA - timestampB;
          });

          let filteredPlaceholderArr: message[] = [];
          for (let i = placeHolderArr.length - 1; i >= 0; i--) {
            const valuedFn = (element: any) =>
              element.otherUserId === placeHolderArr[i].otherUserId;
            if (filteredPlaceholderArr.findIndex(valuedFn) === -1) {
              filteredPlaceholderArr.push(placeHolderArr[i]);
            }
          }
          setMessages(filteredPlaceholderArr);
        });
      }
    );
  });
const goToSingleChat=(userId:string)=>{
     setUserID(`${userId}`);
     navigate("/userChat");
}
  return (
    <div className="bg-gray-800 min-h-screen text-white font-Lobster flex flex-col pt-14 ">
      <h1 className="text-3xl font-bold">All messages</h1>
      {messages && messages.length > 0 && (
        <div className="flex flex-col justify-around mt-4">
          {messages.map((message) =>
            message.read ? (
              <div
                className="border-y-2 border-gray-300 font-semibold border-solid	text-gray-300 cursor-pointer hover:bg-slate-500"
                key={message.otherUserId}
                onClick={() => goToSingleChat(message.otherUserId)}
              >
                <div className="flex ml-2 my-2">
                  <img
                    src={message.otherUserProfilePicture}
                    alt=""
                    className="w-11 h-11 rounded-full"
                  />
                  <p className="text-2xl ml-2">{message.username}</p>
                </div>
                <p className="text-2xl mb-2 ml-4">
                  {message.messageBody.slice(0, 30)}...
                </p>
              </div>
            ) : (
              <div
                className="border-y-3	border-white font-bold border-solid	text-white cursor-pointer hover:bg-slate-500"
                key={message.otherUserId}
                onClick={() => goToSingleChat(message.otherUserId)}
              >
                <div className="flex ml-2 my-2">
                  <img
                    src={message.otherUserProfilePicture}
                    alt=""
                    className="w-11 h-11 rounded-full"
                  />
                  <p className="text-2xl ml-2">{message.username}</p>
                </div>
                <p className="text-2xl mb-2 ml-4">
                  {message.messageBody.slice(0, 30)}...
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
export default MessagesDisp;
