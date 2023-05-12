import React, { useState } from "react";
import icon from "../image_resources/tome-heap-logo_thumbnail.ico";
import ExitBtn from "../image_resources/exitBtn.webp";
import { getFirestore, setDoc, doc } from "firebase/firestore";
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
  const [userFirstName, setUserFirstName] = useState(" ");
  const [userLastName, setUserLastName] = useState(" ");

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
    if (getAuth().currentUser?.photoURL !== " ") {
      await setDoc(
        doc(getFirestore(), "usersData", `user-${getAuth().currentUser?.uid}`),
        { profilePicture: `${getAuth().currentUser?.photoURL}` },
        { merge: true }
      );
    }
    await setDoc(
      doc(getFirestore(), "usersData", `user-${getAuth().currentUser?.uid}`),
      {
        username: `${getAuth().currentUser?.displayName}`,
        userID: `${getAuth().currentUser?.uid}`,
      },
      { merge: true }
    );
  }

  const handleErrors = (message: string) => {
    setErrorStatus("error");
    switch (message) {
      case "Firebase: Error (auth/email-already-in-use).":
        setErrorMessage("email already in use");
        break;
      case "Firebase: Error (auth/user-not-found).":
        setErrorMessage("user not found");
        break;
      case "Firebase: Error (auth/wrong-password).":
        setErrorMessage("wrong email or password");
        break;
      case "Firebase: Error (auth/invalid-email).":
        setErrorMessage("you've entered an invalid email");
        break;
      default:
        console.log(message);
        break;
    }
    setTimeout(() => {
      setErrorStatus(" ");
      setErrorMessage(" ");
    }, 2000);
  };

  async function createUserWithEmail(
    email: string,
    pwd: string,
    userName: string
  ) {
    try {
      await createUserWithEmailAndPassword(auth, email, pwd).then(() => {
        updateProfile(auth.currentUser!, { displayName: userName });
        setDoc(
          doc(
            getFirestore(),
            "usersData",
            `user-${getAuth().currentUser?.uid}`
          ),
          {
            username: userName,
            userID: `${getAuth().currentUser?.uid}`,
          },
          { merge: true }
        );

        signOut(auth);
        setErrorStatus("no error");
        setLogInStatus("log in");
        setTimeout(() => {
          setErrorStatus(" ");
          setErrorMessage(" ");
        }, 2000);
      });
    } catch (e: any) {
      handleErrors(e.message);
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
      handleErrors(e.message);
    }
  }

  function handleSignInLogIn(e: any) {
    e.preventDefault();
    let errorState = false;
    if (signUp) {
      let userName = `${userFirstName} ${userLastName}`;
      createUserWithEmail(email, password, userName);
    } else {
      signInWithEmail(email, password);
    }
  }

  return (
    <div className="absolute w-full h-screen flex justify-center bg-black bg-opacity-50 items-center backdrop-blur-sm">
      <div className=" bg-white w-80 h-1/2 text-center p-7 relative flex flex-col justify-evenly items-center rounded-md">
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
        <form action="" onSubmit={handleSignInLogIn}>
          {signUp && (
            <div>
              <input
                required
                type="text"
                name="userName"
                placeholder=" first name"
                className="border-gray-500 border-2 border-solid w-1/2 h-9 focus:outline-none focus:ring focus:ring-blue-600 rounded-md"
                onChange={(e) => {
                  setUserFirstName(e.target.value);
                }}
              />
              <input
                required
                type="text"
                name="lastName"
                placeholder=" last name"
                className="border-gray-500 border-2 border-solid w-1/2 h-9 focus:outline-none focus:ring focus:ring-blue-600 rounded-md"
                onChange={(e) => {
                  setUserLastName(e.target.value);
                }}
              />
            </div>
          )}
          <input
            type="email"
            name="email"
            required
            placeholder=" e-mail"
            className="border-gray-500 border-2 border-solid w-full h-9 focus:outline-none focus:ring focus:ring-blue-600 rounded-md"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            name="psswrd"
            required
            placeholder=" enter your password"
            className="border-gray-500 border-2 border-solid  w-full h-9 focus:outline-none focus:ring focus:ring-blue-600 rounded-md"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            className="bg-black text-white w-full h-9 hover:bg-gray-800 "
            type="submit"
          >
            {status}
          </button>
        </form>
        <button
          className="bg-amber-500 text-white w-full h-9 hover:bg-amber-400 "
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
