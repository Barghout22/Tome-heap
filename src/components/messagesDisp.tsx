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
 } from "firebase/firestore";
import React from "react";

const MessagesDisp = () => {
  const CurrentUserId = getAuth().currentUser?.uid;

  return (
    <div className="bg-gray-800 min-h-screen text-white font-Lobster flex flex-col pt-14 ">
      <h1>hello messages</h1>
    </div>
  );
};
export default MessagesDisp;
