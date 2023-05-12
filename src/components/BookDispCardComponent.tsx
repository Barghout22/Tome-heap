import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookInfo } from "./BookListView";
import AddBookToUserListBtn from "./addBookToUsrListBtn";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import uniqid from "uniqid"

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

const BookDispCardComponent = ({
  book,
  setBookData,
  userSignInStatus,
  setLogInStatus,
}: {
  book: BookInfo;
  userSignInStatus: boolean;
  setBookData: Function;
  setLogInStatus: Function;
}) => {
  const navigate = useNavigate();
  const [bookPresentInUserList, setBookPresentInUserList] = useState(false);
  useEffect(() => {
    if (userSignInStatus) {
      checkForBook(book.id).then((value) => {
        setBookPresentInUserList(value);
      });
    }
  }, []);

  const moveToBookDisp = (book: any) => {
    setBookData({
      id: book.id,
      bookName: book.bookName,
      author: book.author,
      pageNo: book.pageNo,
      description: book.description,
      imageSrc: book.imageSrc,
    });
    navigate("/singleBookDisplay");
  };

  return (
    <div className="flex flex-col p-4 w-96 h-96 shadow-lg sm:flex-row">
      <img src={book.imageSrc} alt="" className="w-20 sm:h-32" />
      <div className=" flex flex-col m-4 justify-between">
        <div>
          <h2
            className="font-bold text-xl cursor-pointer hover:underline"
            onClick={() => moveToBookDisp(book)}
          >
            {book.bookName}
          </h2>
          <p>
            <span className="font-semibold">author:</span>
            {book.author}
          </p>
          <p>
            <span className="font-semibold">number of pages:</span>
            {book.pageNo}
          </p>
          <p>
            <span className="font-semibold">description:</span>
            {book.description
              ? book.description.length > 90
                ? `${book.description.slice(0, 90)}...
                              `
                : book.description
              : "no description available"}
            {book.description && book.description.length > 100 && (
              <span
                className="underline font-semibold hover:font-bold cursor-pointer"
                onClick={() => moveToBookDisp(book)}
              >
                read more
              </span>
            )}
          </p>
        </div>
        <AddBookToUserListBtn
          userSignInStatus={userSignInStatus}
          setLogInStatus={setLogInStatus}
          book={book}
          bookPresentInUserList={bookPresentInUserList}
          setBookPresentInUserList={setBookPresentInUserList}
        />
      </div>
    </div>
  );
};

export default BookDispCardComponent;
