import React, { useState, useEffect } from "react";
import BookDispCardComponent from "./BookDispCardComponent";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  FieldValue,
} from "firebase/firestore";
import { BookInfo } from "./BookListView";
const ProfileBookDisp = ({
  userID,
  userSignInStatus,
  setBookData,
  setLogInStatus,
}: {
  userID: string;
  userSignInStatus: boolean;
  setBookData: Function;
  setLogInStatus: Function;
}) => {
  const [bookList, setBookList] = useState<BookInfo[]>();
  useEffect(() => {
    let queryResult;
    let bookDataPlaceHolder: BookInfo[] | undefined = [];
    const q = query(collection(getFirestore(), userID));
    const querySnapshot = async () => await getDocs(q);
    querySnapshot().then((result) => {
      queryResult = result.docs;
      queryResult.forEach((value) => {
        bookDataPlaceHolder!.push({
          id: value.data().id,
          bookName: value.data().bookName,
          author: value.data().author,
          pageNo: value.data().pageNo,
          description: value.data().description,
          imageSrc: value.data().imageSrc,
        });
        // console.log(bookDataPlaceHolder);
      });
      //console.log(queryResult);
      setBookList(bookDataPlaceHolder);
    });
  });
  return (
    <div className="bg-gray-800 min-h-screen text-white font-Lobster pt-14">
      <h1 className="text-3xl underline underline-offset-8">My books</h1>

      {bookList ? (
        bookList.length > 0 ? (
          <div className="bg-gray-800 w-screen  flex p-10  flex-wrap gap-6 text-white font-Lobster">
            {bookList.map((item) => (
              <BookDispCardComponent
                book={item}
                setBookData={setBookData}
                userSignInStatus={userSignInStatus}
                setLogInStatus={setLogInStatus}
              />
            ))}
          </div>
        ) : (
          <p className="text-2xl">no Books to display</p>
        )
      ) : null}
    </div>
  );
};

export default ProfileBookDisp;
