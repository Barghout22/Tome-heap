import React from "react";
import { getAuth, signOut } from "firebase/auth";

const ViewUsrShrtcuts = ({
  setUserSignInStatus,
}: {
  setUserSignInStatus: Function;
}) => {
  const signOUt = () => {
    signOut(getAuth());
    setUserSignInStatus(false);
  };
  return (
    <ul className="bg-white w-52 rounded-md absolute top-16 right-10 px-4 py-2 ">
      <li>Profile</li>
      <li>My books</li>
      <li onClick={signOUt}>Sign out</li>
    </ul>
  );
};

export default ViewUsrShrtcuts;
