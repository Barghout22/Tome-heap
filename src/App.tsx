import { useState } from "react";

import "./App.css";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <div className="text-center bg-[url(./image_resources/booksBackground.jpg)] bg-cover h-screen flex flex-col justify-center">
      <div>
        <h1 className="text-5xl text-white">Welcome to tome heap</h1>
        <p className="text-2xl text-white">
          view the newest books and keep track of your readings!
        </p>
      </div>
      <div className="flex justify-center my-6">
        <input
          type="text"
          name=""
          placeholder="find a book/author"
          className="p-5 rounded-l-md transition-all origin-right focus:scale-x-110"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white h-11 w-16 rounded-r-md">
          find
        </button>
      </div>
      <div className="flex flex-col text-white items-center">
        <h3 className="mb-6 text-2xl">browse books by genre</h3>
        <ul className="grid grid-cols-2 w-3/6 gap-y-10">
          <li>romance</li>
          <li>thriller</li>
          <li>self-help</li>
          <li>biography</li>
          <li>history</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
