import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ViewUsrShrtcuts = ({
  setUserSignInStatus,
  switchDispUserValue,
  setViewOwnProfile,
  setUserID,
}: {
  setUserSignInStatus: Function;
  switchDispUserValue: Function;
  setViewOwnProfile: Function;
  setUserID: Function;
}) => {
  const navigate = useNavigate();
  const signOUt = () => {
    signOut(getAuth());
    setUserSignInStatus(false);
    switchDispUserValue();
    navigate("/");
  };
  const goToProfile = () => {
    setViewOwnProfile(true);
    switchDispUserValue();
    navigate("/profile");
  };
  const ViewOwnBooks = () => {
    const userID = `userBookList-${getAuth().currentUser?.uid}`;
    setUserID(userID);
    switchDispUserValue();
    navigate("/ProfileBookListDisplay");
  };
  return (
    <ul className="bg-white w-52 rounded-md absolute top-16 right-10 px-4 py-2 cursor-pointer">
      <li className="hover:bg-slate-400" onClick={goToProfile}>
        Profile
      </li>
      <li className="hover:bg-slate-400" onClick={ViewOwnBooks}>
        My books
      </li>
      <li className="hover:bg-slate-400" onClick={signOUt}>
        Sign out
      </li>
    </ul>
  );
};

export default ViewUsrShrtcuts;
