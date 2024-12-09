// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CreateCar from "./pages/CreateCar";
import CreateCategory from "./pages/CreateCategory";
import EditCategory from "./pages/EditCategory";
import EditCar from "./pages/EditCar";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/createcar" element={<CreateCar />} />
        <Route path="/categories/create" element={<CreateCategory />} />
        <Route path="/categories/edit/:categoryId" element={<EditCategory />} />
        <Route path="/editcar/:id" element={<EditCar />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cars" element={<Cars />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
