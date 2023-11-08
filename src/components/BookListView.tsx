import React, { useState } from "react";
import { useEffect } from "react";
import placeholderImg from "../image_resources/placeholderThumbnail.png";
import BookDispCardComponent from "./BookDispCardComponent";
import uniqid from "uniqid";

export type BookInfo = {
  id: string;
  bookName: string;
  author: string;
  pageNo: number;
  description: string;
  imageSrc?: string;
};

async function reqInfo(
  srchWrd: string,
  srchType: string,
  noOfSearches: number,
  setTotalItems: Function
) {
  let srchPhr = " ";
  if (srchType === "book") {
    srchPhr = srchWrd;
  } else if (srchType === "category") {
    srchPhr = `subject:${srchWrd}`;
  } else if (srchType === "author") {
    srchPhr = `inauthor:${srchWrd}`;
  }
  let url =
    noOfSearches > 0
      ? `https://www.googleapis.com/books/v1/volumes?q=${srchPhr}&startIndex=${noOfSearches}`
      : `https://www.googleapis.com/books/v1/volumes?q=${srchPhr}`;
  const data = await fetch(url);
  const decodeData = data.json();
  const moreDecode = await decodeData;
  setTotalItems(moreDecode.totalItems);
  const DecodeItemsList = moreDecode.items;

  //console.log(DecodeItemsList.totalItems);
  // console.log(DecodeItemsList);
  const adjustVals = DecodeItemsList.map(
    (item: {
      id: any;
      volumeInfo: {
        title: any;
        authors: any;
        pageCount: any;
        description: any;
        imageLinks: { smallThumbnail: any; thumbnail: any };
      };
    }) => {
      let img = placeholderImg;
      if (item.volumeInfo.imageLinks) {
          let bookImage = item.volumeInfo.imageLinks.thumbnail.split(":");
          bookImage![0] += "s:";
          const connectBookImage = bookImage![0] + bookImage![1];
          console.log(connectBookImage);
        img = connectBookImage;
        console.log(img);
      }

      //console.log(img);
      const newItem = {
        id: item.id,
        bookName: item.volumeInfo.title,
        author: item.volumeInfo.authors ? item.volumeInfo.authors[0] : "NA",
        pageNo: item.volumeInfo.pageCount ? item.volumeInfo.pageCount : "NA",
        description: item.volumeInfo.description
          ? item.volumeInfo.description
          : "no description available",
        imageSrc: img,
      };
      return newItem;
    }
  );
  //   console.log(adjustVals);
  return adjustVals;
}
const BookListView = ({
  searchTerm,
  searchType,
  setBookData,
  userSignInStatus,
  setLogInStatus,
  setSearchType,
}: {
  searchTerm: string;
  searchType: string;
  userSignInStatus: boolean;
  setBookData: Function;
  setLogInStatus: Function;
  setSearchType: Function;
}) => {
  const [displayBookList, setdisplaydBookList] = useState<BookInfo[]>([
    {
      id: "string",
      bookName: "string",
      author: "string",
      pageNo: 0,
      description: " string",
      imageSrc: "string",
    },
  ]);
  const [noOfSearches, setNoOfSearches] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    reqInfo(searchTerm, searchType, noOfSearches, setTotalItems).then(
      (items) => {
        setdisplaydBookList(items);
        // console.log(displayBookList);
      }
    );
  }, [searchType]);

  const getMoreResults = () => {
    let searchVal = noOfSearches + 12;
    // console.log("searchvalue", searchVal);

    reqInfo(searchTerm, searchType, searchVal, setTotalItems).then((items) => {
      let bookInfoHolder: BookInfo[] = displayBookList;
      // console.log("book list", displayBookList);
      // console.log("new books", items);
      items.forEach((item: any) => {
        const itemAlreadyIncluded =
          bookInfoHolder.filter((result) => result.id === item.id).length > 0;
        itemAlreadyIncluded ? null : bookInfoHolder.push(item);
      });
      setNoOfSearches(bookInfoHolder.length);
      setdisplaydBookList(bookInfoHolder);
    });
  };
  return (
    <div className="bg-gray-800 min-h-screen text-white font-Lobster pt-14">
      {searchType !== "category" && (
        <ul className="text-3xl flex border-white border-b-2 justify-around w-screen">
          <li
            className={
              searchType === "book"
                ? "text-white "
                : " text-gray-300 cursor-pointer"
            }
            onClick={() => {
              if (searchType !== "book") {
                setSearchType("book");
              }
            }}
          >
            Books
          </li>
          <li
            className={
              searchType === "author"
                ? "text-white "
                : " text-gray-300 cursor-pointer"
            }
            onClick={() => {
              if (searchType !== "author") {
                setSearchType("author");
              }
            }}
          >
            authors
          </li>
        </ul>
      )}
      {totalItems > 0 && (
        <p className="text-2xl mt-4 ml-4">
          displaying {noOfSearches === 0 ? 10 : noOfSearches} out of{" "}
          {totalItems} total results for {searchType}:{" "}
          <span className="font-semibold">{searchTerm}</span>
        </p>
      )}
      {displayBookList.length > 1 && (
        <div className="bg-gray-800 w-screen  flex p-10  flex-wrap gap-6 text-white font-Lobster">
          {displayBookList.map((item) => (
            <BookDispCardComponent
              book={item}
              setBookData={setBookData}
              userSignInStatus={userSignInStatus}
              setLogInStatus={setLogInStatus}
              key={item.id}
            />
          ))}
        </div>
      )}
      <button
        className="w-11/12 bg-white text-black text-center rounded-lg ml-10 mb-10 mt-10 hover:bg-slate-300"
        onClick={getMoreResults}
      >
        Load more results
      </button>
    </div>
  );
};

export default BookListView;
