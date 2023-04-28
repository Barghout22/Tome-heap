import React from "react";
import { BookInfo } from "./BookListView";
import ImagePlaceHolder from "../image_resources/placeholderThumbnail.png";

const SingleBookView = ({ bookData }: { bookData: BookInfo }) => {
  return (
    <div className="bg-gray-800 min-h-screen text-white font-Lobster pt-14">
      <img src={bookData.imageSrc} alt="" />
      <h2>{bookData.bookName}</h2>
      <h2>{bookData.author}</h2>
      <h3>{bookData.pageNo} pages</h3>
      <p>{bookData.description}</p>
      <button className="bg-white rounded-full h-11 text-2xl font-semibold w-44 text-black transition-all hover:bg-black hover:text-white">
        add to my books
      </button>
    </div>
  );
};

export default SingleBookView;
