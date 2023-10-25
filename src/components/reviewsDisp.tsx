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

const ReviewsDisp = ({ userID }: { userID: string }) => {
  const [reviewList, setReviewList] = useState<reviewInfo[]>();
  const [username,setUserName]=useState<string>();
  useEffect(() => {
    let queryResult;
    let reviewDataPlaceHolder: reviewInfo[] | undefined = [];
    const q = query(collection(getFirestore(), `user-${userID}-reviews`));
    const querySnapshot = async () => await getDocs(q);
    querySnapshot().then((result) => {
      queryResult = result.docs;
      queryResult.forEach((value) => {
        const docQuery = query(
          collection(getFirestore(), `userBookList-${userID}`),
          where("id", "==", value.data().bookId)
        );
        getDocs(docQuery).then((querySnapshot) =>
          querySnapshot.forEach(
            (doc) => {
               const time = value.data().timestamp;
               const seconds = time.seconds ? time.seconds * 1000 : 0;
        reviewDataPlaceHolder!.push({
          bookId: value.data().bookId,
          bookName: doc.data().bookName,
          reviewDate: new Date(
            seconds + time.nanoseconds / 1000000
          ).toLocaleString(),
          rating: value.data().rating,
          reviewBody: value.data().review,
        });
        setUserName(value.data().username);

            } )
          
        );
      });
 reviewDataPlaceHolder!.sort( (a, b)=> {
        console.log(
          new Date(b.reviewDate).valueOf(),
          new Date(a.reviewDate).valueOf()
        );
        return (
          new Date(b.reviewDate).valueOf() - new Date(a.reviewDate).valueOf()
        );
      });
      setReviewList(reviewDataPlaceHolder);
      // console.log(reviewDataPlaceHolder);
    });
  },[]);
  return (
    <div className="bg-gray-800 min-h-screen text-white font-Lobster flex flex-col pt-14 ">
      <h1>{username?.split(" ")[0]} reviews</h1>
      {reviewList ? (
        reviewList.length > 0 ? <div>
          {reviewList.map((review) => (
              <div key={review.bookId}>
                <p>
                  reviewed {review.bookName} on{" "}
                  {review.reviewDate}
                </p>
                <p>{review.rating} out of 5</p>
                <p>{review.reviewBody}</p>
              </div>
            ))
          }
        </div>
 
         : (
          <p className="text-2xl">no reviews</p>
        )
      ) : null}
    </div>
  );
};
export default ReviewsDisp;
