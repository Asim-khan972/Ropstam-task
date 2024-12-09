import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../services/axios-Instance";
import { setAuth } from "../store/authSlice";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });
      const data = response.data;
      dispatch(
        setAuth({
          token: data.token,
          name: data.user.name,
          email: data.user.email,
        })
      );
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md "
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md "
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full p-2 rounded-md text-white font-semibold transition-colors duration-300 ${
              isFormValid && !isLoading
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
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
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-medium text-gray-800 hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
