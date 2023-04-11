import React from "react";
import { useEffect } from "react";

const BookListView = ({ searchTerm }: { searchTerm: string }) => {

    useEffect({},[]);
  return <div className="bg-blue-500 h-full w-full">
    <h1 className="text-white">hello {searchTerm}</h1>
  </div>;
};

export default BookListView;
