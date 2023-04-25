import React, { useState } from "react";
import ExitBtn from "../image_resources/exitBtn.webp";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const LogInPopUp = ({
  status,
  setLogInStatus,
  setUserSignInStatus,
}: {
  status: string;
  setLogInStatus: Function;
  setUserSignInStatus: Function;
}) => {
  const signUp = status === "sign up" ? true : false;
  const [userName, setUserName] = useState(" ");
  const [email, setEmail] = useState(" ");
  const [password, setPassword] = useState(" ");
  const auth = getAuth();
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    setUserSignInStatus(true);
    setLogInStatus("none");
  }

  async function createUserWithEmail(
    email: string,
    pwd: string,
    userName: string
  ) {
    try {
      await createUserWithEmailAndPassword(auth, email, pwd);
      signInWithEmail(email, pwd);
      await updateProfile(auth.currentUser!, { displayName: userName });
      console.log(auth.currentUser?.displayName);
    } catch (e) {
      console.log(e);
    }
  }
  async function signInWithEmail(email: string, pwd: string) {
    await signInWithEmailAndPassword(auth, email, pwd);
  }

  function handleSignInLogIn() {
    if (email !== " " && password !== " ") {
      if (signUp) {
        if (userName !== " ") {
          try {
            createUserWithEmail(email, password, userName);
            setUserSignInStatus(true);
          } catch (e) {
            console.log(e);
            return;
          }
          setLogInStatus("none");
        }
      } else {
        try {
          signInWithEmail(email, password);
          setUserSignInStatus(true);
        } catch (e) {
          console.log(e);
          return;
        }
        setLogInStatus("none");
      }
    }
  }

  return (
    <div className="absolute w-full h-full flex justify-center bg-black bg-opacity-50 items-center backdrop-blur-sm">
      <div className=" bg-white w-96 h-1/2 text-center p-7 relative flex flex-col justify-evenly items-center rounded-md">
        <button
          className="absolute w-10 top-[-20px] right-[-20px] "
          onClick={() => setLogInStatus("none")}
        >
          <img
            src={ExitBtn}
            alt=""
            className="rounded-full border-gray-500 border-4 border-solid hover:border-gray-400"
          />
        </button>
        {signUp && (
          <input
            required
            type="text"
            name="userName"
            placeholder="enter your name"
            className="border-gray-500 border-2 border-solid  h-9 focus:outline-none focus:ring focus:ring-blue-600 rounded-md"
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
        )}
        <input
          type="text"
          name="email"
          placeholder="enter your e-mail"
          className="border-gray-500 border-2 border-solid h-9 focus:outline-none focus:ring focus:ring-blue-600 rounded-md"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          name="psswrd"
          placeholder=" enter your password"
          className="border-gray-500 border-2 border-solid h-9 focus:outline-none focus:ring focus:ring-blue-600 rounded-md"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        {signUp && (
          <p>
            Already have an account?
            <span
              className="hover:underline cursor-pointer underline-offset-2"
              onClick={() => setLogInStatus("log in")}
            >
              log in
            </span>
          </p>
        )}
        {!signUp && (
          <p>
            new here?
            <span
              className="hover:underline cursor-pointer underline-offset-2"
              onClick={() => setLogInStatus("sign up")}
            >
              Sign up
            </span>
          </p>
        )}
        <button
          className="bg-amber-500 text-white w-10/12 h-9 hover:bg-amber-400 rounded-md"
          onClick={signInWithGoogle}
        >
          {status} with google
        </button>
        <button
          className="bg-black text-white w-10/12 h-9 hover:bg-gray-800 rounded-md"
          onClick={handleSignInLogIn}
        >
          {status}
        </button>
      </div>
    </div>
  );
};

export default LogInPopUp;
