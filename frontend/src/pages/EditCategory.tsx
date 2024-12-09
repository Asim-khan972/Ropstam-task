import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../services/axios-Instance";

const EditCategory: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/categories/${categoryId}`
        );
        setCategoryName(response.data.name);
      } catch (error: any) {
        console.error("Error fetching category", error);
        setError("Failed to fetch category details.");
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };

  const validateForm = () => {
    return categoryName.trim() !== "";
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Category name cannot be empty.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axiosInstance.put(`/api/categories/${categoryId}`, {
        name: categoryName.trim(),
      });
      navigate("/categories");
    } catch (error: any) {
      console.error("Error updating category", error);
      setError(
        error.response?.data?.message || "Failed to update category. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Edit Category
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleEditCategory}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="category" className="sr-only">
                Category Name
              </label>
              <input
                id="category"
                name="category"
                type="text"
                required
                className="aappearance-none rounded-none relative block w-full px-3 py-5 m-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm "
                placeholder="Edit Category Name"
                value={categoryName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              }`}
            >
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Update Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
