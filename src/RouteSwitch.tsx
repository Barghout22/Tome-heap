import React, { useEffect, useState } from "react";
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
//new components
import FriendListDisp from "./components/friendListDisp";
import FriendRequestDisp from "./components/friendRequestDisp";
import MessagesDisp from "./components/messagesDisp";
import ReviewsDisp from "./components/reviewsDisp";
import SingleChatDisp from "./components/singleChatDisp";
//
import { BookInfo } from "./components/BookListView";
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const userDefaultImage =
  "https://firebasestorage.googleapis.com/v0/b/tome-heap.appspot.com/o/userDefaultImage.png?alt=media&token=ae155369-f1fc-4c82-93fc-12f489301aa7";

const RouteSwitch = () => {
  const [userSignInStatus, setUserSignInStatus] = useState(false); //tells the header if the user is signed in
  const [logInStatus, setLogInStatus] = useState("none"); //tells the page whether to show a sign up or log in form
  const [searchTerm, setSearchTerm] = useState<string>(" "); //used to search by a book name or category
  const [searchType, setSearchType] = useState("book"); //sets the search type to "book" or "category"
  const [dispUserShrtcutMenu, setDispUserShrtcutMenu] = useState(false); //toggles the display of shortcut menu for signed-in users
  const [userID, setUserID] = useState("none"); //used for getting the booklist of a specific user to display it
  const [viewOwnProfile, setViewOwnProfile] = useState(false); //tells profile component if the profile visited is the current user prof
  const [viewedProfileID, setViewedProfileID] = useState(" "); //provides the profile id for the visited profile to the prof. component
  // bookData state is set when user clicks on a specific book in a book list and used to display that book in the single book component
  const [bookData, setBookData] = useState<BookInfo>({
    id: " ",
    bookName: " ",
    author: " ",
    pageNo: 0,
    description: " ",
    imageSrc: " ",
  });
  const [newFriendReqs, setNewFriendReqs] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const switchDispUserValue = () => {
    setDispUserShrtcutMenu(!dispUserShrtcutMenu);
  };
  return (
    <BrowserRouter>
      {userSignInStatus ? (
        <LoggedInHeader
          setUserSignInStatus={setUserSignInStatus}
          switchDispUserValue={switchDispUserValue}
          newFriendReqs={newFriendReqs}
          unreadMessages={unreadMessages}
        />
      ) : (
        <LoggedOutHeader setLogInStatus={setLogInStatus} />
      )}
      {!userSignInStatus && logInStatus !== "none" && (
        <LogInPopUp
          status={logInStatus}
          setLogInStatus={setLogInStatus}
          setUserSignInStatus={setUserSignInStatus}
          setNewFriendReqs={setNewFriendReqs}
          setUnreadMessages={setUnreadMessages}
        />
      )}
      {userSignInStatus && dispUserShrtcutMenu && (
        <ViewUsrShrtcuts
          setUserSignInStatus={setUserSignInStatus}
          switchDispUserValue={switchDispUserValue}
          setViewOwnProfile={setViewOwnProfile}
          setViewedProfileID={setViewedProfileID}
          setUserID={setUserID}
          newFriendReqs={newFriendReqs}
          unreadMessages={unreadMessages}
          setNewFriendReqs={setNewFriendReqs}
          setUnreadMessages={setUnreadMessages}
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
          path="/friends"
          element={
            <FriendListDisp
              setViewOwnProfile={setViewOwnProfile}
              setViewedProfileID={setViewedProfileID}
            />
          }
        />
        <Route
          path="/friendRequests"
          element={
            <FriendRequestDisp
              setNewFriendReqs={setNewFriendReqs}
              setViewOwnProfile={setViewOwnProfile}
              setViewedProfileID={setViewedProfileID}
            />
          }
        />
        <Route
          path="/messages"
          element={
            <MessagesDisp
              setUserID={setUserID}
              setUnreadMessages={setUnreadMessages}
            />
          }
        />
        <Route path="/userChat" element={<SingleChatDisp userID={userID} />} />

        <Route
          path="/reviewsDisplay"
          element={<ReviewsDisp userID={userID} setBookData={setBookData} />}
        />
        <Route
          path="/profile"
          element={
            <ProfileView
              viewOwnProfile={viewOwnProfile}
              viewedProfileID={viewedProfileID}
              setUserID={setUserID}
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
