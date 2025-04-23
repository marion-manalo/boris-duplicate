import Link from "next/link";

// Not found page
export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-lg text-gray-600 mb-6">
                Sorry, the page you're looking for doesn't exist.
            </p>
            <Link href="/">
                <div className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition">
                    Go back home
                </div>
            </Link>
        </div>
    );
}