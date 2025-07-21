import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Page Not Found</p>
      <Link
        to="/"
        className="text-white bg-black px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;