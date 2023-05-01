import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, getDocs } from "firebase/firestore";
import { BookInfo } from "./BookListView";
const ProfileBookDisp = ({ userID }: { userID: string }) => {
  const [bookList, setBookList] = useState<BookInfo[]>();
  useEffect(() => {
    let queryResult;
    const q = query(collection(getFirestore(), userID));
    const querySnapshot = async () => await getDocs(q);
    querySnapshot().then((result) => {
      queryResult = result.docs[0].data;
    });
    console.log(queryResult);
  }, []);
  return <h1>hello</h1>;
};

export default ProfileBookDisp;
