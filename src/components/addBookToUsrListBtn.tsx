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
  // console.log(querySnapshot.docs[0].id);
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
        // console.log(deleteBookID);
        await deleteDoc(doc(getFirestore(), userBookCluster, deleteBookID));

        const bookReviewCluster = `book-${book.id}-reviews`;
        const userReviewID = `user-${getAuth().currentUser?.uid}-review`;
        const userReviewCluster = `user-${getAuth().currentUser?.uid}-reviews`;
        const bookReviewID = `book-${book.id}-review`;

        await deleteDoc(doc(getFirestore(), bookReviewCluster, userReviewID));
        await deleteDoc(doc(getFirestore(), userReviewCluster, bookReviewID));

        setBookPresentInUserList(false);
      }
    }
  };
  return (
    <>
      {!bookPresentInUserList && (
        <button
          className="bg-white rounded-full h-11 mt-4 text-2xl font-semibold w-44 text-black transition-all hover:bg-black hover:text-white"
          onClick={handleAddition}
        >
          {!bookPresentInUserList ? "add to my books" : "Remove from my books"}
        </button>
      )}
      {bookPresentInUserList && (
        <button
          className="bg-white rounded-full h-11 mt-6 text-xl font-semibold w-44 text-black transition-all hover:bg-red-500 hover:text-white"
          onClick={handleAddition}
        >
          Remove from my books
        </button>
      )}
    </>
  );
};
export default AddBookToUserListBtn;
