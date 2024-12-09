import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axios-Instance";
import { Pencil, Trash } from "lucide-react";

const Cars = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [totalCars, setTotalCars] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState<string>("registrationNo");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, [page, limit, sort, sortOrder]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/cars?page=${page}&limit=${limit}&sort=${sort}&order=${sortOrder}`
      );
      setCars(response.data.cars);
      setTotalCars(response.data.totalCars);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSort = (column: string) => {
    setSort((prevSort) => {
      if (prevSort === column) {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
        console.log(
          `Sorting by: ${column} Order: ${sortOrder === "asc" ? "desc" : "asc"}`
        );
        return column;
      } else {
        setSortOrder("asc");
        console.log(`Sorting by: ${column} Order: asc`);
        return column;
      }
    });
  };

  const handleDeleteCar = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/cars/${id}`);
      setCars((prevCars) => prevCars.filter((car) => car._id !== id));
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  console.log("..............", sort, sortOrder);

  return (
    <div className="p-8 min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl">Cars</h2>
        <button
          onClick={() => navigate("/createcar")}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Create Car
        </button>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center p-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No data available yet.
          </div>
        ) : (
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                {["category", "color", "model", "make", "registrationNo"].map(
                  (field) => (
                    <th
                      key={field}
                      className="border px-4 py-2 cursor-pointer"
                      onClick={() => handleSort(field)}
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      {sort === field && (
                        <span
                          className={`ml-2 text-sm text-gray-600 ${
                            sortOrder === "asc" ? "↑" : "↓"
                          }`}
                        ></span>
                      )}
                    </th>
                  )
                )}
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{car.category?.name}</td>
                  <td className="border px-4 py-2">{car.color}</td>
                  <td className="border px-4 py-2">{car.model}</td>
                  <td className="border px-4 py-2">{car.make}</td>
                  <td className="border px-4 py-2">{car.registrationNo}</td>
                  <td className="border px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/editcar/${car._id}`)}
                        className="text-black hover:bg-gray-200 p-2 rounded transition duration-200 flex items-center"
                      >
                        <Pencil className="h-5 w-5 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCar(car._id)}
                        className="text-red-500 hover:bg-red-100 p-2 rounded transition duration-200 flex items-center"
                      >
                        <Trash className="h-5 w-5 mr-2" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="limit" className="text-gray-700">
            Rows per page:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {[5, 10, 15, 20].map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-black text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {page} of {Math.ceil(totalCars / limit)}
          </span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page * limit >= totalCars}
            className="bg-black text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cars;
