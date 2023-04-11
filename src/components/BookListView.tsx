import React, { useState } from "react";
import { useEffect } from "react";
import placeholderImg from "../image_resources/placeholderThumbnail.png";

// AIzaSyAcl6xS8fFRelnC9x3fg_avvQSt4A87a8Y

type BookData = {
  id: "string";
  bookName: "string";
  author: "string";
  pageNo: "number";
  imageSrc?: "string";
};

async function reqInfo(srchWrd: string, srchType: string) {
  let srchPhr = " ";
  if (srchType === "book") {
    srchPhr = srchWrd;
  } else if (srchType === "category") {
    srchPhr = `subject:${srchWrd}`;
  }

  const data = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${srchPhr}`
  );

  const decodeData = data.json();
  const moreDecode = await decodeData;
  const DecodeItemsList = moreDecode.items;

  const adjustVals = DecodeItemsList.map(
    (item: {
      id: any;
      volumeInfo: {
        title: any;
        authors: any;
        pageCount: any;
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
        author: item.volumeInfo.authors,
        pageNo: item.volumeInfo.pageCount,
        imageSrc: img,
      };
      return newItem;
    }
  );
  console.log(adjustVals);
  return adjustVals;
}
const BookListView = ({
  searchTerm,
  searchType,
}: {
  searchTerm: string;
  searchType: string;
}) => {
  const [dsplydBkLst, setdsplydBkLst] = useState<BookData[] | undefined>();

  useEffect(() => {
    reqInfo(searchTerm, searchType).then((items) => {
      setdsplydBkLst(items);
    });
  });
  return (
    <div className="bg-blue-500 h-screen w-screen flex flex-col p-8 flex-wrap gap-2">
      {dsplydBkLst
        ? dsplydBkLst.map((item) => {
            return (
              <div key={item.id} className="flex p-5">
                <img src={item.imageSrc} alt="" className="h-12" />
                <div className=" grid grid-cols-2 grid-rows-2 gap-2">
                  <h2>{item.bookName}</h2>
                  <p>author:{item.author}</p>
                  <p>number of pages:{item.pageNo}</p>
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default BookListView;
