import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import App from "./App";
import Header from "./components/Header";
import LogInPopUp from "./components/loginPopUp";
import ProfileView from "./components/ProfileView";
import BookListView from "./components/BookListView";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
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
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
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

const RouteSwitch = () => {
  const [userSignInStatus, setUserSignInStatus] = useState("not signed in");
  const [logInStatus, setLogInStatus] = useState("none");
  const [searchTerm, setSearchTerm] = useState<string>(" ");
  const [searchType, setSearchType] = useState("book");
  return (
    <BrowserRouter>
      <Header setLogInStatus={setLogInStatus} />
      {logInStatus !== "none" && (
        <LogInPopUp status={logInStatus} setLogInStatus={setLogInStatus} />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <App setSearchTerm={setSearchTerm} setSearchType={setSearchType} />
          }
        />
        <Route path="/profile" element={<ProfileView />} />
        <Route
          path="/bookListDisplay"
          element={
            <BookListView searchTerm={searchTerm} searchType={searchType} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
export default RouteSwitch;
