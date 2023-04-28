import React, { useState } from "react";
import { useEffect } from "react";
import placeholderImg from "../image_resources/placeholderThumbnail.png";
import { useNavigate } from "react-router-dom";

// AIzaSyAcl6xS8fFRelnC9x3fg_avvQSt4A87a8Y

export type BookInfo = {
  id: string;
  bookName: string;
  author: string;
  pageNo: number;
  description: string;
  imageSrc?: string;
};

async function reqInfo(srchWrd: string, srchType: string) {
  let srchPhr = " ";
  if (srchType === "book") {
    srchPhr = srchWrd;
  } else if (srchType === "category") {
    srchPhr = `subject:${srchWrd}`;
  }

  const data = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${srchPhr}&maxResults=40`
  );
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
  const [dsplydBkLst, setdsplydBkLst] = useState<BookInfo[] | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    reqInfo(searchTerm, searchType).then((items) => {
      setdsplydBkLst(items);
    });
  });

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
    <div className="bg-gray-800 min-h-screen text-white font-Lobster pt-14">
      <h1 className="text-3xl underline underline-offset-8">
        displaying results for:{" "}
        <span className="font-semibold">{searchTerm}</span>
      </h1>

      <div className="bg-gray-800 w-screen  flex p-10  flex-wrap gap-6 text-white font-Lobster">
        {dsplydBkLst
          ? dsplydBkLst.map((item) => {
              return (
                <div key={item.id} className="flex p-4 w-96 h-96 shadow-lg">
                  <img src={item.imageSrc} alt="" className="h-32" />
                  <div className=" flex flex-col m-4 justify-between">
                    <div>
                      <h2 className="font-bold text-2xl">{item.bookName}</h2>
                      <p>
                        <span className="font-semibold">author:</span>
                        {item.author}
                      </p>
                      <p>
                        <span className="font-semibold">number of pages:</span>
                        {item.pageNo}
                      </p>
                      <p>
                        <span className="font-semibold">description:</span>
                        {item.description
                          ? item.description.length > 200
                            ? `${item.description.slice(0, 200)}...
                              `
                            : item.description
                          : "no description available"}
                        {item.description && item.description.length > 200 && (
                          <p
                            className="underline font-semibold hover:font-bold cursor-pointer"
                            onClick={() => moveToBookDisp(item)}
                          >
                            read more
                          </p>
                        )}
                      </p>
                    </div>
                    <button className="bg-white rounded-full h-11 text-2xl font-semibold w-44 text-black transition-all hover:bg-black hover:text-white">
                      add to my books
                    </button>
                  </div>
                </div>
              );
            })
          : null}
      </div>
      <button>Load more results</button>
    </div>
  );
};

export default BookListView;
