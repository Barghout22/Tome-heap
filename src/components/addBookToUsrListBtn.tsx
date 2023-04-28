import React from "react";

const AddBookToUserListBtn = () => {
  const handleAddition = () => {};
  return (
    <button
      className="bg-white rounded-full h-11 mt-14 text-2xl font-semibold w-44 text-black transition-all hover:bg-black hover:text-white"
      onClick={handleAddition}
    >
      add to my books
    </button>
  );
};
export default AddBookToUserListBtn;
