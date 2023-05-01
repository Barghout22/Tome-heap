import React from "react";
import { useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { BookInfo } from "./BookListView";

const checkForBook = async (id: string) => {
  const userBookCluster = `userBookList-${getAuth().currentUser?.uid}`;
  const q = query(
    collection(getFirestore(), userBookCluster),
    where("id", "==", id)
  );
  const querySnapshot = await getDocs(q);
  console.log(querySnapshot.docs[0].id);
  return querySnapshot.docs[0].id;
};

const AddBookToUserListBtn = ({
  userSignInStatus,
  setLogInStatus,
  book,
  bookPresentInUserList,
  setBookPresentInUserList,
}: {
  userSignInStatus: boolean;
  setLogInStatus: Function;
  book: BookInfo;
  bookPresentInUserList: boolean;
  setBookPresentInUserList: Function;
}) => {
  const handleAddition = async () => {
    if (!userSignInStatus) {
      setLogInStatus("sign up");
    } else {
      const userBookCluster = `userBookList-${getAuth().currentUser?.uid}`;
      if (!bookPresentInUserList) {
        try {
          await addDoc(collection(getFirestore(), userBookCluster), book);
          setBookPresentInUserList(true);
        } catch (e) {
          console.error(e);
        }
      } else {
        const q = query(
          collection(getFirestore(), userBookCluster),
          where("id", "==", book.id)
        );
        const querySnapshot = await getDocs(q);
        const deleteBookID = querySnapshot.docs[0].id;
        console.log(deleteBookID);
        await deleteDoc(doc(getFirestore(), userBookCluster, deleteBookID));
        setBookPresentInUserList(false);
      }
    }
  };
  return (
    <>
      {!bookPresentInUserList && (
        <button
          className="bg-white rounded-full h-11 mt-14 text-2xl font-semibold w-44 text-black transition-all hover:bg-black hover:text-white"
          onClick={handleAddition}
        >
          add to my books
        </button>
      )}
      {bookPresentInUserList && (
        <button
          className="bg-white rounded-full h-11 mt-14 text-xl font-semibold w-44 text-black transition-all hover:bg-red-500 hover:text-white"
          onClick={handleAddition}
        >
          Remove from my books
        </button>
      )}
    </>
  );
};
export default AddBookToUserListBtn;
