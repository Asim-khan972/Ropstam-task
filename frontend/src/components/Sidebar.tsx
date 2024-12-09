import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-full p-4">
      <h2 className="text-2xl mb-6">Menu</h2>
      <ul>
        <li className="mb-4">
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className="mb-4">
          <Link to="/categories">Categories</Link>
        </li>
        <li className="mb-4">
          <Link to="/cars">Cars</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
