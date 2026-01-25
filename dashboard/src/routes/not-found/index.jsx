import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
            <AlertTriangle size={64} className="text-blue-600 mb-6" />

            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                404 — Page Not Found
            </h1>

            <p className="text-gray-600 mb-6 max-w-md">
                The page you’re looking for doesn’t exist or was moved.
            </p>

            <Link
                to="/"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;
