import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookInfo } from "./BookListView";
import { userDefaultImage } from "../RouteSwitch";
import {
  getFirestore,
  collection,
  query,
  where,
  addDoc,
  getDocs,
  setDoc,
  deleteDoc,
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
  bookPresentInUserList: boolean,
  setBookPresentInUserList: Function,
  bookData: BookInfo,
  photoURL: string,
  review?: string
) => {
  const reviewDoc = {
    username: username,
    photoURL: photoURL !== " " ? photoURL : userDefaultImage,
    userId: userId,
    bookId: bookId,
    bookName:bookData.bookName,
    rating: rating,
    review: review,
    timestamp: serverTimestamp(),
  };
  await setDoc(
    doc(getFirestore(), `book-${bookId}-reviews`, `user-${userId}-review`),
    reviewDoc
  ).catch((e) => console.log(e));
  await setDoc(
    doc(getFirestore(), `user-${userId}-reviews`, `book-${bookId}-review`),
    reviewDoc
  ).catch((e) => console.log(e));
  if (!bookPresentInUserList) {
    await addDoc(
      collection(getFirestore(), `userBookList-${getAuth().currentUser?.uid}`),
      bookData
    ).then(() => setBookPresentInUserList(true));
  }
};

const SingleBookView = ({
  bookData,
  userSignInStatus,
  setLogInStatus,
  setViewOwnProfile,
  setViewedProfileID,
}: {
  bookData: BookInfo;
  userSignInStatus: boolean;
  setLogInStatus: Function;
  setViewOwnProfile: Function;
  setViewedProfileID: Function;
}) => {
  const navigate = useNavigate();
  const [bookPresentInUserList, setBookPresentInUserList] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [bookStarRating, setBookStarRating] = useState(0);
  const [bookReview, setBookReview] = useState(" ");
  const [userHasRviewd, setUserHasRviewd] = useState(true);
  const [editReviewStatus, setEditReviewStatus] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);
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
    let userReviewPlaceHolder: any;
    checkForReviews(bookData.id).then((results) => {
      let ratingPlaceHolder: number = 0;
      results.docs.forEach((value) => {
        const time = value.data().timestamp;
        const seconds = time.seconds ? time.seconds * 1000 : 0;
        let infoHolderObj = {
          userName: value.data().username,
          profilePicSource: value.data().photoURL,
          userId: value.data().userId,
          bookId: value.data().bookId,
          rating: value.data().rating,
          review: value.data().review,
          timeStamp: new Date(
            seconds + time.nanoseconds / 1000000
          ).toLocaleString(),
        };
        if (getAuth().currentUser?.uid === value.data().userId) {
          setBookReview(value.data().review);
          setBookStarRating(value.data().rating);
          userReviewPlaceHolder = infoHolderObj;
        } else {
          if (reviewListPLaceHolder.length > 0) {
            reviewListPLaceHolder.splice(0, 0, infoHolderObj);
          } else {
            reviewListPLaceHolder.push(infoHolderObj);
          }
        }
        ratingPlaceHolder += Number(value.data().rating);
      });

      userReviewPlaceHolder
        ? reviewListPLaceHolder.unshift(userReviewPlaceHolder)
        : setUserHasRviewd(false);
      ratingPlaceHolder /= reviewListPLaceHolder.length;
      ratingPlaceHolder = Number(ratingPlaceHolder.toFixed(2));
      setAverageRating(ratingPlaceHolder);
      setPreviousBookReviews(reviewListPLaceHolder);
    });
  }, []);
  const handleRatingInput = (e: any) => {
    setBookStarRating(e.target.value);
  };
  const handleReviewInput = (e: any) => {
    e.preventDefault();
    if (bookStarRating !== 0) {
      let reviewsPlaceHolder = previousBookReviews;
      userHasRviewd ? reviewsPlaceHolder.shift() : null;
      const currentDate = new Date().toLocaleString();
      const newReview = {
        userName: getAuth().currentUser!.displayName!,
        profilePicSource:
          getAuth().currentUser!.photoURL !== " "
            ? getAuth().currentUser!.photoURL!
            : userDefaultImage,
        userId: getAuth().currentUser!.uid,
        bookId: bookData.id,
        rating: bookStarRating,
        review: bookReview,
        timeStamp: currentDate,
      };
      reviewsPlaceHolder.unshift(newReview);
      setPreviousBookReviews(reviewsPlaceHolder);
      let placeHolderAverageRating = 0;
      reviewsPlaceHolder.forEach((review) => {
        placeHolderAverageRating += Number(review.rating);
      });
      placeHolderAverageRating /= reviewsPlaceHolder.length;
      setAverageRating(placeHolderAverageRating);
      setEditReviewStatus(false);
      setUserHasRviewd(true);

      addReview(
        getAuth().currentUser!.displayName!,
        getAuth().currentUser!.uid,
        bookStarRating,
        bookData.id,
        bookPresentInUserList,
        setBookPresentInUserList,
        bookData,
        getAuth().currentUser!.photoURL || " ",
        bookReview !== " " ? bookReview : " "
      ).then(() => {
        window.scrollTo(0, 0);
        setUpdateStatus(true);
      });
    }
  };
  const goToProfile = (userId: string) => {
    if (getAuth().currentUser?.uid === userId) {
      setViewOwnProfile(true);
      setViewedProfileID("none");
    } else {
      setViewOwnProfile(false);
      setViewedProfileID(userId);
    }

    navigate("/profile");
  };

  const deleteReview = async () => {
    const reviewListPlaceholder = previousBookReviews;
    reviewListPlaceholder.shift();
    setPreviousBookReviews(reviewListPlaceholder);
    setUserHasRviewd(false);
    setBookStarRating(0);
    setBookReview(" ");
    if (reviewListPlaceholder.length > 0) {
      let averageRating = 0;
      reviewListPlaceholder.forEach((review) => {
        averageRating += Number(review.rating);
      });
      averageRating /= reviewListPlaceholder.length;
      setAverageRating(averageRating);
    }
    const bookReviewCluster = `book-${bookData.id}-reviews`;
    const userReviewID = `user-${getAuth().currentUser?.uid}-review`;
    const userReviewCluster = `user-${getAuth().currentUser?.uid}-reviews`;
    const bookReviewID = `book-${bookData.id}-review`;

    await deleteDoc(doc(getFirestore(), bookReviewCluster, userReviewID));
    await deleteDoc(doc(getFirestore(), userReviewCluster, bookReviewID));
  };
  return (
    <>
      {updateStatus && (
        <div className="absolute w-screen	h-screen bg-black bg-opacity-50">
          <div className="absolute top-1/3 left-1/3 bg-white text-black rounded-xl font-Lobster text-3xl p-8 font-bold">
            <p> Review saved</p>
            <button
              className="bg-black text-white rounded-full h-11 mt-2 text-2xl font-semibold w-44 transition-all"
              onClick={() => {
                setUpdateStatus(false);
              }}
            >
              ok
            </button>
          </div>
        </div>
      )}
      <div className="bg-gray-800 min-h-screen text-white font-Lobster pt-20  pl-6 sm:pl-14">
        <div className="flex flex-col sm:flex-row items-center">
          <img src={bookData.imageSrc} className="w-6/12 h-fit sm:w-1/3" />
          <div className="flex flex-col ml-10 mr-10">
            <h1 className="font-bold text-3xl">{bookData.bookName}</h1>
            <h2 className="text-2xl">{bookData.author}</h2>
            <h3 className="text-2xl">{bookData.pageNo} pages</h3>
            <p className="text-md sm:text-xl">{bookData.description}</p>
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
            className="flex flex-col w-10/12 sm:w-2/3 sm:p-12 "
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
                  onChange={handleRatingInput}
                  defaultChecked={bookStarRating == 1 ? true : false}
                />
                1 star
              </label>
              <label>
                <input
                  type="radio"
                  name="book-rating"
                  value="2"
                  defaultChecked={bookStarRating == 2 ? true : false}
                  onChange={handleRatingInput}
                />
                2 stars
              </label>
              <label>
                <input
                  type="radio"
                  name="book-rating"
                  value="3"
                  defaultChecked={bookStarRating == 3 ? true : false}
                  onChange={handleRatingInput}
                />
                3 stars
              </label>
              <label>
                <input
                  type="radio"
                  name="book-rating"
                  value="4"
                  defaultChecked={bookStarRating == 4 ? true : false}
                  onChange={handleRatingInput}
                />
                4 stars
              </label>
              <label>
                <input
                  type="radio"
                  name="book-rating"
                  defaultChecked={bookStarRating == 5 ? true : false}
                  value="5"
                  onChange={handleRatingInput}
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
                // console.log(e.target.value);
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
        {!editReviewStatus && previousBookReviews.length > 0 && (
          <div className="mt-12 pb-12">
            <h1 className="text-3xl font-bold underline underline-offset-2">
              Reviews:
            </h1>
            {previousBookReviews.map((review) => {
              const isThisCurrentUser =
                getAuth().currentUser?.uid === review.userId;
              const editableReview = isThisCurrentUser
                ? !editReviewStatus
                : true;
              return (
                <div
                  className={
                    editableReview
                      ? "text-white text-2xl py-10 border-b-2"
                      : "hidden"
                  }
                  key={review.userId}
                >
                  <img className="w-20" src={review.profilePicSource} alt="" />
                  <h2
                    className="cursor-pointer hover:underline"
                    onClick={() => goToProfile(review.userId)}
                  >
                    {review.userName}
                  </h2>
                  <h2>{review.timeStamp}</h2>
                  <p>{review.rating} stars</p>
                  <p>{review.review}</p>
                  {isThisCurrentUser && (
                    <>
                      <button
                        className="bg-white rounded-full h-11 mt-4 text-2xl font-semibold w-36 text-black transition-all hover:bg-black hover:text-white"
                        onClick={() => {
                          setEditReviewStatus(true);
                        }}
                      >
                        edit review
                      </button>
                      <button
                        className="bg-white rounded-full h-11 mt-4 text-2xl font-semibold w-36 ml-3 text-black transition-all hover:bg-red-500 hover:text-white"
                        onClick={deleteReview}
                      >
                        delete review
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default SingleBookView;

//
