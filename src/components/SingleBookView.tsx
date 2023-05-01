import React from "react";
import { useEffect, useState } from "react";
import { BookInfo } from "./BookListView";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import AddBookToUserListBtn from "./addBookToUsrListBtn";

const checkForBook = async (id: string) => {
  const userBookCluster = `userBookList-${getAuth().currentUser?.uid}`;
  let returnVal = false;
  const q = query(
    collection(getFirestore(), userBookCluster),
    where("id", "==", id)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.docs.length > 0 ? (returnVal = true) : (returnVal = false);
  return returnVal;
};
const SingleBookView = ({
  bookData,
  userSignInStatus,
  setLogInStatus,
}: {
  bookData: BookInfo;
  userSignInStatus: boolean;
  setLogInStatus: Function;
}) => {
  const [bookPresentInUserList, setBookPresentInUserList] = useState(false);
  useEffect(() => {
    if (userSignInStatus) {
      checkForBook(bookData.id).then((value) => {
        setBookPresentInUserList(value);
      });
    }
  }, []);
  return (
    <div className="bg-gray-800 min-h-screen text-white font-Lobster pt-20  pl-14">
      <div className="flex ">
        <img src={bookData.imageSrc} className="w-3/12 h-fit" />
        <div className="flex flex-col ml-10 mr-10">
          <h1 className="font-bold text-3xl">{bookData.bookName}</h1>
          <h2 className="text-2xl">{bookData.author}</h2>
          <h3 className="text-2xl">{bookData.pageNo} pages</h3>
          <p className="text-xl">{bookData.description}</p>
          <AddBookToUserListBtn
            userSignInStatus={userSignInStatus}
            setLogInStatus={setLogInStatus}
            book={bookData}
            bookPresentInUserList={bookPresentInUserList}
            setBookPresentInUserList={setBookPresentInUserList}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleBookView;
