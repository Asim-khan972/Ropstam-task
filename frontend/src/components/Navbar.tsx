import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const { name, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-black p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl">
          <Link to="/">My App</Link>
        </h1>
        <div className="hidden md:flex space-x-4 items-center">
          {token ? (
            <>
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link to="/categories" className="hover:underline">
                Categories
              </Link>
              <Link to="/cars" className="hover:underline">
                Cars
              </Link>
              <p>Welcome, {name}!</p>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-2">
          {token ? (
            <>
              <Link to="/dashboard" className="block py-2 hover:bg-gray-700">
                Dashboard
              </Link>
              <Link to="/categories" className="block py-2 hover:bg-gray-700">
                Categories
              </Link>
              <Link to="/cars" className="block py-2 hover:bg-gray-700">
                Cars
              </Link>
              <p className="py-2">Welcome, {name}!</p>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 hover:bg-gray-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 hover:bg-gray-700">
                Login
              </Link>
              <Link to="/register" className="block py-2 hover:bg-gray-700">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
