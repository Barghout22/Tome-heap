import React from "react";
import { useNavigate } from "react-router-dom";
import { BookInfo } from "./BookListView";
import AddBookToUserListBtn from "./addBookToUsrListBtn";
// import uniqid from "uniqid"

const BookDispCardComponent = ({
  book,
  setBookData,
}: {
  book: BookInfo;
  setBookData: Function;
}) => {
  const navigate = useNavigate();
  const moveToBookDisp = (book: any) => {
    setBookData({
      id: book.id,
      bookName: book.bookName,
      author: book.author,
      pageNo: book.pageNo,
      description: book.description,
      imageSrc: book.imageSrc,
    });
    navigate("/singleBookDisplay");
  };

  return (
    <div key={book.id} className="flex p-4 w-96 h-96 shadow-lg">
      <img src={book.imageSrc} alt="" className="h-32" />
      <div className=" flex flex-col m-4 justify-between">
        <div>
          <h2
            className="font-bold text-xl cursor-pointer hover:underline"
            onClick={() => moveToBookDisp(book)}
          >
            {book.bookName}
          </h2>
          <p>
            <span className="font-semibold">author:</span>
            {book.author}
          </p>
          <p>
            <span className="font-semibold">number of pages:</span>
            {book.pageNo}
          </p>
          <p>
            <span className="font-semibold">description:</span>
            {book.description
              ? book.description.length > 100
                ? `${book.description.slice(0, 100)}...
                              `
                : book.description
              : "no description available"}
            {book.description && book.description.length > 100 && (
              <span
                className="underline font-semibold hover:font-bold cursor-pointer"
                onClick={() => moveToBookDisp(book)}
              >
                read more
              </span>
            )}
          </p>
        </div>
        <AddBookToUserListBtn />
      </div>
    </div>
  );
};

export default BookDispCardComponent;
