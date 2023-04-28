import React, { useState } from "react";
import { useEffect } from "react";
import placeholderImg from "../image_resources/placeholderThumbnail.png";
import BookDispCardComponent from "./BookDispCardComponent";

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
  noOfSearches: number
) {
  let srchPhr = " ";
  if (srchType === "book") {
    srchPhr = srchWrd;
  } else if (srchType === "category") {
    srchPhr = `subject:${srchWrd}`;
  }
  let url =
    noOfSearches > 0
      ? `https://www.googleapis.com/books/v1/volumes?q=${srchPhr}&startIndex=${noOfSearches}`
      : `https://www.googleapis.com/books/v1/volumes?q=${srchPhr}`;
  const data = await fetch(url);
  const decodeData = data.json();
  const moreDecode = await decodeData;
  // console.log(moreDecode);
  const DecodeItemsList = moreDecode.items;

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
        img = item.volumeInfo.imageLinks.thumbnail;
      }

      //console.log(img);
      const newItem = {
        id: item.id,
        bookName: item.volumeInfo.title,
        author: item.volumeInfo.authors ? item.volumeInfo.authors[0] : "NA",
        pageNo: item.volumeInfo.pageCount,
        description: item.volumeInfo.description,
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
}: {
  searchTerm: string;
  searchType: string;
  setBookData: Function;
}) => {
  const [displayBookList, setdsplydBkLst] = useState<BookInfo[] | undefined>();
  const [noOfSearches, setNoOfSearches] = useState(0);

  useEffect(() => {
    reqInfo(searchTerm, searchType, noOfSearches).then((items) => {
      setdsplydBkLst(items);
    });
  });

  const getMoreResults = () => {
    let searchVal = noOfSearches + 11;
    let bookInfoHolder = displayBookList;
    setNoOfSearches(searchVal);
    console.log(noOfSearches);
    reqInfo(searchTerm, searchType, searchVal).then((items) => {
      bookInfoHolder = [...bookInfoHolder!, ...items];
      console.log(noOfSearches);
      console.log(bookInfoHolder);
      setdsplydBkLst(bookInfoHolder);
      console.log(displayBookList);
    });
  };
  return (
    <div className="bg-gray-800 min-h-screen text-white font-Lobster pt-14">
      <h1 className="text-3xl underline underline-offset-8">
        displaying results for:{" "}
        <span className="font-semibold">{searchTerm}</span>
      </h1>

      {displayBookList && (
        <div className="bg-gray-800 w-screen  flex p-10  flex-wrap gap-6 text-white font-Lobster">
          {displayBookList.map((item) => (
            <BookDispCardComponent book={item} setBookData={setBookData} />
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
