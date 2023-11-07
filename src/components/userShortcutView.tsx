import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ViewUsrShrtcuts = ({
  setUserSignInStatus,
  switchDispUserValue,
  setViewOwnProfile,
  setViewedProfileID,
  setUserID,
  newFriendReqs,
  unreadMessages,
  setNewFriendReqs,
  setUnreadMessages,
}: {
  setUserSignInStatus: Function;
  switchDispUserValue: Function;
  setViewOwnProfile: Function;
  setViewedProfileID: Function;
  setUserID: Function;
  newFriendReqs: number;
  unreadMessages: number;
  setNewFriendReqs: Function;
  setUnreadMessages: Function;
}) => {
  const navigate = useNavigate();
  const signOUt = () => {
    signOut(getAuth());
    setUserSignInStatus(false);
    switchDispUserValue();
    setNewFriendReqs(0);
    setUnreadMessages(0);
    navigate("/");
  };
  const goToProfile = () => {
    setViewOwnProfile(true);
    setViewedProfileID(" ");
    switchDispUserValue();
    navigate("/profile");
  };
  const ViewOwnBooks = () => {
    const userID = `${getAuth().currentUser?.uid}`;
    setUserID(userID);
    switchDispUserValue();
    navigate("/ProfileBookListDisplay");
  };
  const viewFriends = () => {
    switchDispUserValue();
    navigate("/friends");
  };
  const viewFriendRequests = () => {
    switchDispUserValue();
    navigate("/friendRequests");
  };
  const viewMessages = () => {
    switchDispUserValue();
    navigate("/messages");
  };
  return (
    <ul className="bg-white w-52 rounded-md absolute top-16 right-10 px-4 py-2 cursor-pointer">
      <li className="hover:bg-slate-400" onClick={goToProfile}>
        my profile
      </li>
      <li className="hover:bg-slate-400" onClick={ViewOwnBooks}>
        My books
      </li>
      <li className="hover:bg-slate-400" onClick={viewFriends}>
        Friends
      </li>
      <li className="hover:bg-slate-400" onClick={viewFriendRequests}>
        Friend requests {newFriendReqs > 0 ? `(${newFriendReqs})` : null}
      </li>
      <li className="hover:bg-slate-400" onClick={viewMessages}>
        Messages {unreadMessages > 0 ? `(${unreadMessages})` : null}
      </li>
      <li className="hover:bg-slate-400" onClick={signOUt}>
        Sign out
      </li>
    </ul>
  );
};

export default ViewUsrShrtcuts;
