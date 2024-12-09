import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import axiosInstance from "../services/axios-Instance";
import { BarChart, Users, Car, List } from "lucide-react";

const Dashboard: React.FC = () => {
  const [carCount, setCarCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { name, email } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [carsResponse, categoriesResponse] = await Promise.all([
          axiosInstance.get("/api/cars"),
          axiosInstance.get("/api/categories"),
        ]);
        setCarCount(carsResponse.data.totalCars);
        setCategoryCount(categoriesResponse.data.totalCategories);
      } catch (error) {
        console.error("Error fetching counts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
  }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
      <div className="p-3 bg-blue-100 rounded-full">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );

  const ActionButton: React.FC<{
    title: string;
    onClick: () => void;
    icon: React.ReactNode;
  }> = ({ title, onClick, icon }) => (
    <button
      onClick={onClick}
      className="flex items-center justify-center space-x-2 bg-black text-white p-3 rounded-lg hover:bg-gray-600 transition-colors w-full"
    >
      {icon}
      <span>{title}</span>
    </button>
  );

  if (loading) {
    // Loader JSX
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
          <p className="mt-4 text-gray-700">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Dashboard
        </h2>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Welcome, {name}!
          </h3>
          <p className="text-gray-600">Email: {email}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Cars"
            value={carCount}
            icon={<Car size={24} className="text-black" />}
          />
          <StatCard
            title="Categories"
            value={categoryCount}
            icon={<List size={24} className="text-green-500" />}
          />
          <StatCard
            title="Demo"
            value={10}
            icon={<Users size={24} className="text-yellow-500" />}
          />
          <StatCard
            title="Demo"
            value={5000}
            icon={<BarChart size={24} className="text-purple-500" />}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ActionButton
            title="Manage Categories"
            onClick={() => navigate("/categories")}
            icon={<List size={20} />}
          />
          <ActionButton
            title="Manage Cars"
            onClick={() => navigate("/cars")}
            icon={<Car size={20} />}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
