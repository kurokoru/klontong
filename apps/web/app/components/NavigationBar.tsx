import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

export function NavigationBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Initialize search from URL params
  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
  }, [searchParams]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/products/list?search=${encodeURIComponent(searchQuery.trim())}`);
      }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e as any);
    }
  };

  return (
      <nav class="bg-white border-gray-200">
      {/* Top Bar */}
      {/* <div className="bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-1 flex justify-between items-center text-sm">
          <div className="flex space-x-4">
            <a href="#" className="hover:underline">Supplier</a>
            <a href="#" className="hover:underline">Trade Assurance</a>
            <a href="#" className="hover:underline">App</a>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:underline">Sign In</a>
            <a href="#" className="hover:underline">Join Free</a>
            <a href="#" className="hover:underline">Help</a>
          </div>
        </div>
      </div> */}

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-1">
        <div className="flex items-center justify-between py-2">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-orange-400">
            Klontong
          </Link>

          {/* Search Bar */}
          <div className="flex-1 mx-8">
            <div className="flex max-auto">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  placeholder="What are you looking for..."
                  className="flex-1 px-6 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button className="bg-orange-500 text-white px-6 py-2 rounded-r-full hover:bg-orange-600 font-medium">
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-center text-gray-600 hover:text-orange-500 cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex flex-col items-center text-gray-600 hover:text-orange-500 cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 font-medium">
              Create Account
            </button>
          </div>
        </div>
      </div>

      {/* Category Menu */}
      <div className="bg-gray-100 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 py-3 overflow-x-auto">
            <a href="#" className="whitespace-nowrap text-gray-700 hover:text-orange-500 font-medium">All Categories</a>
            <a href="#" className="whitespace-nowrap text-gray-700 hover:text-orange-500">Ready to Ship</a>
            <a href="#" className="whitespace-nowrap text-gray-700 hover:text-orange-500">Trade Shows</a>
            <a href="#" className="whitespace-nowrap text-gray-700 hover:text-orange-500">Buyer Central</a>
            <a href="#" className="whitespace-nowrap text-gray-700 hover:text-orange-500">Sell on Klontong</a>
          </div>
        </div>
      </div>
    </nav>
  );
}