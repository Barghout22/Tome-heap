import React from "react";
import { useEffect, useState } from "react";
import { BookInfo } from "./BookListView";
import profileImagePlaceHolder from "../image_resources/userDefaultImage.png";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
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
const checkForReviews = async (bookId: string) => {
  const BookReviewCluster = `book-${bookId}-reviews`;
  const q = query(collection(getFirestore(), BookReviewCluster));
  const results = await getDocs(q);
  return results;
};

const addReview = async (
  username: string,

  userId: string,
  rating: number,
  bookId: string,
  photoURL?: string,
  review?: string
) => {
  const reviewDoc = {
    username: username,
    photoURL: photoURL || profileImagePlaceHolder,
    userId: userId,
    bookId: bookId,
    rating: rating,
    review: review,
    timestamp: serverTimestamp(),
  };
  await setDoc(
    doc(getFirestore(), `book-${bookId}-reviews`, `user-${userId}-review`),
    reviewDoc
  );
  await setDoc(
    doc(getFirestore(), `user-${userId}-reviews`, `book-${bookId}-review`),
    reviewDoc
  );
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
  const [averageRating, setAverageRating] = useState(0);
  const [bookStarRating, setBookStarRating] = useState(0);
  const [bookReview, setBookReview] = useState(" ");
  const [userHasRviewd, setUserHasRviewd] = useState(false);
  const [editReviewStatus, setEditReviewStatus] = useState(false);
  const [previousBookReviews, setPreviousBookReviews] = useState([
    {
      userName: " ",
      profilePicSource: " ",
      userId: " ",
      timeStamp: " ",
      rating: 0,
      review: " ",
    },
  ]);
  useEffect(() => {
    if (userSignInStatus) {
      checkForBook(bookData.id).then((value) => {
        setBookPresentInUserList(value);
      });
    }
    let reviewListPLaceHolder: any[] = [];
    checkForReviews(bookData.id).then((results) => {
      let ratingPlaceHolder = 0;
      results.docs.forEach((value) => {
        let time = value.data().timestamp;
        let infoHolderObj = {
          userName: value.data().username,
          profilePicSource: value.data().photoURL,
          userId: value.data().userId,
          bookId: value.data().bookId,
          rating: value.data().rating,
          review: value.data().review,
          timeStamp: new Date(time.seconds * 1000 + time.nanoseconds / 1000000),
        };
        if (getAuth().currentUser?.uid === value.data().userId) {
          setUserHasRviewd(true);
          setBookReview(value.data().review);
          setBookStarRating(value.data().rating);
        }

        ratingPlaceHolder += value.data().rating;
        reviewListPLaceHolder.push(infoHolderObj);
      });
      ratingPlaceHolder /= reviewListPLaceHolder.length;
      setAverageRating(ratingPlaceHolder);
      setPreviousBookReviews(reviewListPLaceHolder);
    });
  }, [editReviewStatus]);
  const handleRatingInput = (e: any) => {
    if (userSignInStatus) {
      //console.log(e.target.value);
      setBookStarRating(e.target.value);
    } else {
      setLogInStatus("sign up");
    }
  };
  const handleReviewInput = (e: any) => {
    e.preventDefault();
    if (userSignInStatus && bookStarRating !== 0) {
      addReview(
        getAuth().currentUser!.displayName!,
        getAuth().currentUser!.uid,
        bookStarRating,
        bookData.id,
        getAuth().currentUser!.photoURL || undefined,
        bookReview !== " " ? bookReview : undefined
      );
      setEditReviewStatus(false);
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
          <p>
            current average rating:{" "}
            {averageRating > 0
              ? `${averageRating} stars (${previousBookReviews.length} review(s))`
              : "no ratings on this book"}
          </p>
          <AddBookToUserListBtn
            userSignInStatus={userSignInStatus}
            setLogInStatus={setLogInStatus}
            book={bookData}
            bookPresentInUserList={bookPresentInUserList}
            setBookPresentInUserList={setBookPresentInUserList}
          />
        </div>
      </div>

      {userSignInStatus && (!userHasRviewd || editReviewStatus) && (
        <form
          onSubmit={handleReviewInput}
          className="flex flex-col w-2/3 mt-12"
        >
          <p className="text-2xl font-semibold ml-4 mt-5">
            rate this book from 1 to 5 stars
          </p>
          <span className="flex w-1/2 justify-around">
            <label>
              <input
                type="radio"
                name="book-rating"
                value="1"
                required
                defaultChecked={bookStarRating === 1}
                onClick={handleRatingInput}
              />
              1 star
            </label>
            <label>
              <input
                type="radio"
                name="book-rating"
                value="2"
                defaultChecked={bookStarRating === 2}
                onClick={handleRatingInput}
              />
              2 stars
            </label>
            <label>
              <input
                type="radio"
                name="book-rating"
                value="3"
                defaultChecked={bookStarRating === 3}
                onClick={handleRatingInput}
              />
              3 stars
            </label>
            <label>
              <input
                type="radio"
                name="book-rating"
                value="4"
                defaultChecked={bookStarRating === 4}
                onClick={handleRatingInput}
              />
              4 stars
            </label>
            <label>
              <input
                type="radio"
                name="book-rating"
                defaultChecked={bookStarRating === 5}
                value="5"
                onClick={handleRatingInput}
              />
              5 stars
            </label>
          </span>

          <textarea
            cols={30}
            rows={10}
            className="border-2 border-white bg-gray-800 text-white font-Lobster text-2xl p-4"
            defaultValue={bookReview}
            onChange={(e) => {
              console.log(e.target.value);
              setBookReview(e.target.value);
            }}
          ></textarea>
          <button
            type="submit"
            className="bg-white rounded-full h-11 mt-4 text-2xl font-semibold w-44 text-black transition-all hover:bg-black hover:text-white"
          >
            Save review
          </button>
        </form>
      )}
      {previousBookReviews.length > 0 ? (
        <div>
          <h1>reviews:</h1>
          {previousBookReviews.map((review) => {
            const isThisCurrentUser =
              getAuth().currentUser?.uid === review.userId;
            const editableReview = isThisCurrentUser ? !editReviewStatus : true;
            console.log(review.userName);
            console.log(review.profilePicSource);
            return (
              <div
                className={editableReview ? "text-white text-2xl" : "hidden"}
                key={review.userId}
              >
                <img className="w-20" src={review.profilePicSource} alt="" />
                <h2>{review.userName}</h2>
                <h2>{review.timeStamp.toString()}</h2>
                <p>{review.rating} stars</p>
                <p>{review.review}</p>
                {isThisCurrentUser && (
                  <button
                    className="bg-white rounded-full h-11 mt-4 text-2xl font-semibold w-44 text-black transition-all hover:bg-black hover:text-white"
                    onClick={() => {
                      setEditReviewStatus(true);
                    }}
                  >
                    edit review
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default SingleBookView;

//
