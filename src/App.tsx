import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./App.css";

function App({
  setSearchTerm,
  setSearchType,
}: {
  setSearchTerm: Function;
  setSearchType: Function;
}) {
  const [srchTrmPlcHldr, setSrchTrmPlcHldr] = useState(" ");
  const navigate = useNavigate();

  const handleSearch = (searchValue: string) => {
    if (searchValue !== " ") {
      setSearchType("book");
      setSearchTerm(searchValue);
      navigate("/bookListDisplay");
    }
  };
  const handleCategSrch = (searchValue: string) => {
    setSearchType("category");
    setSearchTerm(searchValue);
    navigate("/bookListDisplay");
  };

  return (
    <div className="text-center bg-[url(./image_resources/booksBackground.jpg)] bg-cover h-screen flex flex-col justify-center ">
      <div>
        <h1 className="md:text-5xl text-white font-Pacifico text-2xl">
          Welcome to tome heap
        </h1>
        <p className="md:text-xl text-white font-Pacifico text-lg">
          view the newest books and keep track of your readings!
        </p>
      </div>
      <div className="flex justify-center my-6">
        <input
          type="text"
          name=""
          placeholder="find a book/author"
          className="w-48 sm:w-auto px-5 rounded-l-md transition-all origin-right focus:scale-x-110"
          onChange={(e) => {
            setSrchTrmPlcHldr(e.target.value);
          }}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white h-11 w-16 rounded-r-md"
          onClick={() => {
            handleSearch(srchTrmPlcHldr);
          }}
        >
          find
        </button>
      </div>
      <div className="flex flex-col text-white items-center">
        <h3 className="mb-6 text-2xl font-Lobster">browse books by genre</h3>
        <ul className="grid grid-cols-3 w-52 gap-y-6 gap-x-8">
          <li
            className="hover:underline underline-offset-2 cursor-pointer font-Lobster"
            onClick={() => {
              handleCategSrch("romance");
            }}
          >
            romance
          </li>
          <li
            className="hover:underline underline-offset-2 cursor-pointer font-Lobster"
            onClick={() => {
              handleCategSrch("thriller");
            }}
          >
            thriller
          </li>
          <li
            className="hover:underline underline-offset-2 cursor-pointer font-Lobster"
            onClick={() => {
              handleCategSrch("self-help");
            }}
          >
            self-help
          </li>
          <li
            className="hover:underline underline-offset-2 cursor-pointer font-Lobster"
            onClick={() => {
              handleCategSrch("biography");
            }}
          >
            Biography
          </li>
          <li
            className="hover:underline underline-offset-2 cursor-pointer font-Lobster"
            onClick={() => {
              handleCategSrch("history");
            }}
          >
            History
          </li>
          <li
            className="hover:underline underline-offset-2 cursor-pointer font-Lobster"
            onClick={() => {
              handleCategSrch("mystery");
            }}
          >
            Mystery
          </li>
          <li
            className="hover:underline underline-offset-2 cursor-pointer font-Lobster"
            onClick={() => {
              handleCategSrch("comic books");
            }}
          >
            Comic books
          </li>
          <li
            className="hover:underline underline-offset-2 cursor-pointer font-Lobster"
            onClick={() => {
              handleCategSrch("action and adventure");
            }}
          >
            Action & Adventure
          </li>
          <li
            className="hover:underline underline-offset-2 cursor-pointer font-Lobster"
            onClick={() => {
              handleCategSrch("Fantasy");
            }}
          >
            Fantasy
          </li>
          <li
            className="hover:underline underline-offset-2 cursor-pointer font-Lobster"
            onClick={() => {
              handleCategSrch("Horror");
            }}
          >
            Horror
          </li>
          <li
            className="hover:underline underline-offset-2 cursor-pointer font-Lobster"
            onClick={() => {
              handleCategSrch("Manga");
            }}
          >
            Manga
          </li>
          <li
            className="hover:underline underline-offset-2 cursor-pointer font-Lobster"
            onClick={() => {
              handleCategSrch("superheroes");
            }}
          >
            superheroes
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
