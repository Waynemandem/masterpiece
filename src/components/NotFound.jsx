import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white px-6 text-center">
      <h1 className="text-6xl font-bold text-yellow-400 mb-4">
        404
      </h1>

      <h2 className="text-2xl font-semibold mb-2">
        Page Not Found
      </h2>

      <p className="text-gray-400 mb-6 max-w-md">
        The page you're looking for doesn’t exist.
        It either moved, got deleted, or never existed.
        Which is honestly impressive.
      </p>

      <Link
        to="/"
        className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;