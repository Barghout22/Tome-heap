import React, { useState } from "react";
import icon from "../image_resources/tome-heap-logo_thumbnail.ico";
import ExitBtn from "../image_resources/exitBtn.webp";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
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
  const [errorStatus, setErrorStatus] = useState(" ");
  const [errorMessage, setErrorMessage] = useState(" ");
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
      await createUserWithEmailAndPassword(auth, email, pwd).then(() => {
        updateProfile(auth.currentUser!, { displayName: userName });
        signOut(auth);
        setErrorStatus("no error");
        setLogInStatus("log in");
        setTimeout(() => {
          setErrorStatus(" ");
          setErrorMessage(" ");
        }, 2000);
      });
    } catch (e: any) {
      // console.log(e.message);
      setErrorStatus("error");
      setErrorMessage(e.message);
      setTimeout(() => {
        setErrorStatus(" ");
        setErrorMessage(" ");
      }, 2000);
    }
  }
  async function signInWithEmail(email: string, pwd: string) {
    try {
      await signInWithEmailAndPassword(auth, email, pwd).then(() => {
        // console.log(auth.currentUser?.displayName);
        setLogInStatus("none");
        setUserSignInStatus(true);
      });
    } catch (e: any) {
      // console.log(e.message);
      setErrorStatus("error");
      setErrorMessage(e.message);
      setTimeout(() => {
        setErrorStatus(" ");
        setErrorMessage(" ");
      }, 2000);
    }
  }

  function handleSignInLogIn() {
    let errorState = false;
    if (email !== " " && password !== " ") {
      if (signUp) {
        if (userName !== " ") {
          createUserWithEmail(email, password, userName);
        }
      } else {
        signInWithEmail(email, password);
      }
    }
  }

  return (
    <div className="absolute w-full h-screen flex justify-center bg-black bg-opacity-50 items-center backdrop-blur-sm">
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
        <div className="flex">
          <img src={icon} className="rounded-full  w-9 h-9 ml-2 my-2" alt="" />
          <h2 className="my-3 text-3xl font-Pacifico ">tH</h2>
        </div>
        <p>*all fields are required to proceed</p>
        {errorStatus === "error" && (
          <p className="text-red-900 bg-red-400 bg-opacity-25">
            {errorMessage}
          </p>
        )}
        {errorStatus === "no error" && (
          <p className="text-green-900 bg-green-400 bg-opacity-25">
            "sign up successful. Please sign in to contiune"
          </p>
        )}
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

        <button
          className="bg-black text-white w-10/12 h-9 hover:bg-gray-800 "
          onClick={handleSignInLogIn}
        >
          {status}
        </button>
        <button
          className="bg-amber-500 text-white w-10/12 h-9 hover:bg-amber-400 "
          onClick={signInWithGoogle}
        >
          {status} with google
        </button>
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
      </div>
    </div>
  );
};

export default LogInPopUp;
