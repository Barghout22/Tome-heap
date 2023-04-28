import React from "react";
import { BookInfo } from "./BookListView";
import AddBookToUserListBtn from "./addBookToUsrListBtn";

const SingleBookView = ({ bookData }: { bookData: BookInfo }) => {
  return (
    <div className="bg-gray-800 min-h-screen text-white font-Lobster pt-20  pl-14">
      <div className="flex ">
        <img src={bookData.imageSrc} className="w-5/12 h-fit" />
        <div className="flex flex-col ml-10 mr-10">
          <h1 className="font-bold text-3xl">{bookData.bookName}</h1>
          <h2 className="text-2xl">{bookData.author}</h2>
          <h3 className="text-2xl">{bookData.pageNo} pages</h3>
          <p className="text-xl">{bookData.description}</p>
          <AddBookToUserListBtn />
        </div>
      </div>
    </div>
  );
};

export default SingleBookView;
