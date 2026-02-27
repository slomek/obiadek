import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Obiadek
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Your dinner planning assistant powered by Trello
      </p>
      <Link
        to="/dinners"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        View Dinners
      </Link>
    </div>
  );
}
