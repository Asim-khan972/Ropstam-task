import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axios-Instance";

const CreateCar: React.FC = () => {
  const [formData, setFormData] = useState({
    color: "",
    model: "",
    make: "",
    registrationNo: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setFormLoading(true);
      try {
        const response = await axiosInstance.get("/api/categories/");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories", error);
        setError("Failed to load categories.");
      } finally {
        setFormLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData({ ...formData, category: value });
  };

  const validateForm = () => {
    for (const key in formData) {
      if (formData[key as keyof typeof formData].trim() === "") {
        return false;
      }
    }
    return true;
  };

  const handleCreateCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post("/api/cars", formData);
      navigate("/cars");
    } catch (error) {
      console.error("Error creating car", error);
      setError("Failed to create car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {formLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create Car
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleCreateCar}>
            <div className="rounded-md shadow-sm -space-y-px">
              {(["color", "model", "make", "registrationNo"] as const).map(
                (field, index) => (
                  <div key={field}>
                    <label htmlFor={field} className="sr-only">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      id={field}
                      name={field}
                      type="text"
                      required
                      className={`appearance-none rounded-none relative block w-full px-3 py-5 m-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm ${
                        index === 0
                          ? "rounded-t-md"
                          : index === 3
                          ? "rounded-b-md"
                          : ""
                      }`}
                      placeholder={`Car ${
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }`}
                      value={formData[field]}
                      onChange={handleInputChange}
                    />
                  </div>
                )
              )}

              <div>
                <label htmlFor="category" className="sr-only">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-5 m-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                  value={formData.category}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
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
                    : "bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
                  "Add Car"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateCar;
