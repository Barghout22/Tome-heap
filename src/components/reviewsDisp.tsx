import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  where,
  FieldValue,
} from "firebase/firestore";

type reviewInfo = {
  bookId: string;
  bookName: string;
  reviewDate: string;
  rating: number;
  reviewBody: string;
};

const ReviewsDisp = ({
  userID,
  setBookData,
}: {
  userID: string;
  setBookData: Function;
}) => {
  const navigate = useNavigate();
  const [reviewList, setReviewList] = useState<reviewInfo[]>();
  const [username, setUserName] = useState<string>();
  useEffect(() => {
    let queryResult;
    let reviewDataPlaceHolder: reviewInfo[] | undefined = [];
    const q = query(collection(getFirestore(), `user-${userID}-reviews`));
    getDocs(q).then((result) => {
      queryResult = result.docs;
      queryResult.forEach((value) => {
        const time = value.data().timestamp;
        const seconds = time.seconds ? time.seconds * 1000 : 0;
        reviewDataPlaceHolder!.push({
          bookId: value.data().bookId,
          bookName: value.data().bookName,
          reviewDate: new Date(
            seconds + time.nanoseconds / 1000000
          ).toLocaleString(),
          rating: value.data().rating,
          reviewBody: value.data().review,
        });
        setUserName(value.data().username);
      });

      if (reviewDataPlaceHolder) {
        reviewDataPlaceHolder!.sort((a, b) => {
          return (
            new Date(b.reviewDate).valueOf() - new Date(a.reviewDate).valueOf()
          );
        });
        setReviewList(reviewDataPlaceHolder);
      }
    });
  }, []);
  const goToBook = (bookId: string) => {
    const docQuery = query(
      collection(getFirestore(), `userBookList-${userID}`),
      where("id", "==", bookId)
    );
    getDocs(docQuery).then((querySnapshot) =>
      querySnapshot.forEach((doc) => {
        setBookData({
          id: doc.data().id,
          bookName: doc.data().bookName,
          author: doc.data().author,
          pageNo: doc.data().pageNo,
          description: doc.data().description,
          imageSrc: doc.data().imageSrc,
        });
        navigate("/singleBookDisplay");
      })
    );
  };
  return (
    <div className="bg-gray-800 min-h-screen text-white font-Lobster flex flex-col pt-14 ">
      <h1 className="text-4xl texit-bold ml-2">
        {username?.split(" ")[0]} reviews
      </h1>
      {reviewList ? (
        reviewList.length > 0 ? (
          <div>
            {reviewList.map((review) => (
              <div key={review.bookId} className="ml-4 mt-4">
                <p className="text-2xl mb-2"> 
                  reviewed{" "}
                  <span
                    onClick={() => goToBook(review.bookId)}
                    className="hover:underline hover:cursor-pointer"
                  >
                    {" "}
                    {review.bookName}{" "}
                  </span>
                  on {review.reviewDate}
                </p>
                <p className="text-2xl">{review.reviewBody}</p>
                <p className="text-2xl">{review.rating} out of 5</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-2xl">no reviews</p>
        )
      ) : null}
    </div>
  );
};
export default ReviewsDisp;
