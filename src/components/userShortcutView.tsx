import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ViewUsrShrtcuts = ({
  setUserSignInStatus,
  switchDispUserValue,
  setViewOwnProfile,
}: {
  setUserSignInStatus: Function;
  switchDispUserValue: Function;
  setViewOwnProfile: Function;
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
    navigate("/profile");
    switchDispUserValue();
  };
  return (
    <ul className="bg-white w-52 rounded-md absolute top-16 right-10 px-4 py-2 cursor-pointer">
      <li className="hover:bg-slate-400" onClick={goToProfile}>
        Profile
      </li>
      <li className="hover:bg-slate-400">My books</li>
      <li className="hover:bg-slate-400" onClick={signOUt}>
        Sign out
      </li>
    </ul>
  );
};

export default ViewUsrShrtcuts;
