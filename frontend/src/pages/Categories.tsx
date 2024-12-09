import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axios-Instance";
import { Pencil, Trash } from "lucide-react";

const CategoryTable = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCategories, setTotalCategories] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(
          `/api/categories?page=${page}&limit=${limit}`
        );
        setCategories(response.data.categories);
        setTotalCategories(response.data.totalCategories);
      } catch (error) {
        console.error("Error fetching categories", error);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [page, limit, refresh]);

  const handleDeleteCategory = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/categories/${id}`);
      setCategories(categories.filter((category) => category.id !== id));
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error deleting category", error);
      setError("Failed to delete category.");
    }
  };

  const handleEditCategory = (id: string) => {
    navigate(`/categories/edit/${id}`);
  };

  const handleCreateCategory = () => {
    navigate("/categories/create");
  };

  return (
    <div className="p-8 min-h-screen flex flex-col bg-gray-50">
      <h2 className="text-3xl mb-4 text-gray-800 font-semibold">Categories</h2>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl text-gray-700">Existing Categories</h3>
        <button
          onClick={handleCreateCategory}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
        >
          Create Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">No data found.</p>
      ) : (
        <>
          <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr className="text-sm text-left font-semibold text-gray-700">
                  <th className="px-4 py-2">Category Name</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{category.name}</td>
                    <td className="border px-4 py-2 flex gap-4">
                      <button
                        onClick={() => handleEditCategory(category._id)}
                        className="text-black hover:bg-gray-200 p-2 rounded transition duration-200 flex items-center"
                      >
                        <Pencil className="h-5 w-5 mr-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-red-500 hover:bg-red-100 p-2 rounded transition duration-200 flex items-center"
                      >
                        <Trash className="h-5 w-5 mr-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center items-center gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="bg-black text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {page} of {Math.ceil(totalCategories / limit)}
            </span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page * limit >= totalCategories}
              className="bg-black text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryTable;
