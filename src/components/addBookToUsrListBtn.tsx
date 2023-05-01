import React from "react";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { BookInfo } from "./BookListView";

const AddBookToUserListBtn = ({
  userSignInStatus,
  setLogInStatus,
  book,
}: {
  userSignInStatus: boolean;
  setLogInStatus: Function;
  book: BookInfo;
}) => {
  const handleAddition = async () => {
    if (userSignInStatus) {
      console.log(getAuth().currentUser?.uid);
      const userBookCluster = `userBookList-${getAuth().currentUser?.uid}`;
      try {
        await addDoc(collection(getFirestore(), userBookCluster), book);
      } catch (e) {
        console.error(e);
      }
    } else {
      setLogInStatus("sign up");
    }
  };
  return (
    <button
      className="bg-white rounded-full h-11 mt-14 text-2xl font-semibold w-44 text-black transition-all hover:bg-black hover:text-white"
      onClick={handleAddition}
    >
      add to my books
    </button>
  );
};
export default AddBookToUserListBtn;
