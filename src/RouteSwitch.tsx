import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import App from "./App";
import LoggedOutHeader from "./components/LoggedOutHeader";
import LoggedInHeader from "./components/LoggedInHeader";
import LogInPopUp from "./components/loginPopUp";
import ProfileView from "./components/ProfileView";
import BookListView from "./components/BookListView";
import ViewUsrShrtcuts from "./components/userShortcutView";
import SingleBookView from "./components/SingleBookView";
import ProfileBookDisp from "./components/profileBookDisplay";
import { BookInfo } from "./components/BookListView";
import { initializeApp } from "firebase/app";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
  apiKey: "AIzaSyAUJVdYNnGggkCMDHwjV2z-1f0LXpv0AiQ",
  authDomain: "tome-heap.firebaseapp.com",
  projectId: "tome-heap",
  storageBucket: "tome-heap.appspot.com",
  messagingSenderId: "713434341677",
  appId: "1:713434341677:web:5ef056ceb8a3e06d7733a4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const userDefaultImage =
  "https://firebasestorage.googleapis.com/v0/b/tome-heap.appspot.com/o/userDefaultImage.png?alt=media&token=ae155369-f1fc-4c82-93fc-12f489301aa7";

const RouteSwitch = () => {
  const [userSignInStatus, setUserSignInStatus] = useState(false);
  const [logInStatus, setLogInStatus] = useState("none");
  const [searchTerm, setSearchTerm] = useState<string>(" ");
  const [searchType, setSearchType] = useState("book");
  const [dispUserShrtcutMenu, setDispUserShrtcutMenu] = useState(false);
  const [userID, setUserID] = useState("none");
  const [viewOwnProfile, setViewOwnProfile] = useState(false);
  const [viewedProfileID, setViewedProfileID] = useState(" ");

  const [bookData, setBookData] = useState<BookInfo>({
    id: " ",
    bookName: " ",
    author: " ",
    pageNo: 0,
    description: " ",
    imageSrc: " ",
  });

  const switchDispUserValue = () => {
    setDispUserShrtcutMenu(!dispUserShrtcutMenu);
  };
  return (
    <BrowserRouter>
      {userSignInStatus ? (
        <LoggedInHeader
          setUserSignInStatus={setUserSignInStatus}
          switchDispUserValue={switchDispUserValue}
        />
      ) : (
        <LoggedOutHeader setLogInStatus={setLogInStatus} />
      )}
      {!userSignInStatus && logInStatus !== "none" && (
        <LogInPopUp
          status={logInStatus}
          setLogInStatus={setLogInStatus}
          setUserSignInStatus={setUserSignInStatus}
        />
      )}
      {userSignInStatus && dispUserShrtcutMenu && (
        <ViewUsrShrtcuts
          setUserSignInStatus={setUserSignInStatus}
          switchDispUserValue={switchDispUserValue}
          setViewOwnProfile={setViewOwnProfile}
          setViewedProfileID={setViewedProfileID}
          setUserID={setUserID}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <App setSearchTerm={setSearchTerm} setSearchType={setSearchType} />
          }
        />
        <Route
          path="/profile"
          element={
            <ProfileView
              viewOwnProfile={viewOwnProfile}
              viewedProfileID={viewedProfileID}
            />
          }
        />
        <Route
          path="/bookListDisplay"
          element={
            <BookListView
              searchTerm={searchTerm}
              searchType={searchType}
              setBookData={setBookData}
              userSignInStatus={userSignInStatus}
              setLogInStatus={setLogInStatus}
              setSearchType={setSearchType}
            />
          }
        />
        <Route
          path="/singleBookDisplay"
          element={
            <SingleBookView
              bookData={bookData}
              userSignInStatus={userSignInStatus}
              setLogInStatus={setLogInStatus}
              setViewOwnProfile={setViewOwnProfile}
              setViewedProfileID={setViewedProfileID}
            />
          }
        />
        <Route
          path="/ProfileBookListDisplay"
          element={
            <ProfileBookDisp
              userID={userID}
              userSignInStatus={userSignInStatus}
              setBookData={setBookData}
              setLogInStatus={setLogInStatus}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
export default RouteSwitch;
