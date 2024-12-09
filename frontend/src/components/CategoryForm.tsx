// src/components/CategoryForm.tsx
export {}; // This solves the TS1208 error

import { useState } from "react";
import axios from "axios";

const CategoryForm = () => {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/categories", {
        name: categoryName,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error creating category", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-2xl text-center mb-4">Add Category</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          placeholder="Category Name"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
