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
  const [bookStarRating, setBookStarRating] = useState(0);
  const [bookReview, setBookReview] = useState(" ");
  useEffect(() => {
    if (userSignInStatus) {
      checkForBook(bookData.id).then((value) => {
        setBookPresentInUserList(value);
      });
    }
  }, []);
  const handleRatingInput = (e: any) => {
    if (userSignInStatus) {
      console.log(e.target.value);
    } else {
      setLogInStatus("sign up");
    }
  };
  const handleReviewInput = (e: any) => {
    e.preventDefault();
    if (userSignInStatus) {
      console.log(e.target.value);
    } else {
      setLogInStatus("sign up");
    }
  };
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
      <p className="text-2xl font-semibold ml-4 mt-5">
        rate this book from 1 to 5 stars
      </p>
      <span className="flex w-1/2 justify-around">
        <label>
          <input
            type="radio"
            name="book-rating"
            value="1"
            onClick={handleRatingInput}
          />
          1 star
        </label>
        <label>
          <input
            type="radio"
            name="book-rating"
            value="2"
            onClick={handleRatingInput}
          />
          2 stars
        </label>
        <label>
          <input
            type="radio"
            name="book-rating"
            value="3"
            onClick={handleRatingInput}
          />
          3 stars
        </label>
        <label>
          <input
            type="radio"
            name="book-rating"
            value="4"
            onClick={handleRatingInput}
          />
          4 stars
        </label>
        <label>
          <input
            type="radio"
            name="book-rating"
            value="5"
            onClick={handleRatingInput}
          />
          5 stars
        </label>
      </span>

      {userSignInStatus && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("review is being processed");
          }}
          className="flex flex-col w-2/3 mt-12"
        >
          <textarea
            cols={30}
            rows={10}
            className="border-2 border-white bg-gray-800 text-white font-Lobster text-2xl p-4"
            placeholder="write a review about this book"
          ></textarea>
          <button
            type="submit"
            className="bg-white rounded-full h-11 mt-4 text-2xl font-semibold w-44 text-black transition-all hover:bg-black hover:text-white"
          >
            add review
          </button>
        </form>
      )}
    </div>
  );
};

export default SingleBookView;
