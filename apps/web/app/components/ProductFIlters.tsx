import { Form, useSearchParams, useSubmit } from 'react-router';
import { useState, useEffect } from 'react';

export function ProductFilters() {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const handleFilterChange = (name: string, value: string, checked?: boolean) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (name === 'category') {
      if (checked) {
        newSearchParams.set('category', value);
      } else {
        newSearchParams.delete('category');
      }
    } else if (name === 'status') {
      if (checked) {
        newSearchParams.set('status', value);
      } else {
        newSearchParams.delete('status');
      }
    }
    
    // Reset to page 1 when filtering
    newSearchParams.set('page', '1');
    
    submit(newSearchParams, { method: 'get' });
  };

  const handlePriceFilter = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (minPrice) {
      newSearchParams.set('minPrice', minPrice);
    } else {
      newSearchParams.delete('minPrice');
    }
    
    if (maxPrice) {
      newSearchParams.set('maxPrice', maxPrice);
    } else {
      newSearchParams.delete('maxPrice');
    }
    
    // Reset to page 1 when filtering
    newSearchParams.set('page', '1');
    
    submit(newSearchParams, { method: 'get' });
  };

  const clearAllFilters = () => {
    const newSearchParams = new URLSearchParams();
    // Keep search term if it exists
    const search = searchParams.get('search');
    if (search) {
      newSearchParams.set('search', search);
    }
    submit(newSearchParams, { method: 'get' });
    setMinPrice('');
    setMaxPrice('');
  };

  const activeFiltersCount = [...searchParams.entries()].filter(
    ([key]) => !['page', 'limit', 'sortBy', 'sortOrder'].includes(key)
  ).length;

  return (
    <div className="w-64 bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Filters</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-orange-500 hover:text-orange-600"
          >
            Clear all ({activeFiltersCount})
          </button>
        )}
      </div>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Category</h4>
        <div className="space-y-2">
          {[
            { id: '1', name: 'Electronics' },
            { id: '2', name: 'Fashion' },
            { id: '3', name: 'Home & Garden' },
            { id: '4', name: 'Sports' },
            { id: '5', name: 'Automotive' }
          ].map((category) => (
            <label key={category.id} className="flex items-center">
              <input 
                type="checkbox" 
                checked={searchParams.get('category') === category.id}
                onChange={(e) => handleFilterChange('category', category.id, e.target.checked)}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" 
              />
              <span className="ml-2 text-sm text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="flex space-x-2 mb-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <span className="text-gray-500 self-center">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
        <button
          onClick={handlePriceFilter}
          className="w-full py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        >
          Apply Price Filter
        </button>
      </div>
      
      {/* Status Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Status</h4>
        <div className="space-y-2">
          {[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ].map((status) => (
            <label key={status.value} className="flex items-center">
              <input 
                type="checkbox" 
                checked={searchParams.get('status') === status.value}
                onChange={(e) => handleFilterChange('status', status.value, e.target.checked)}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" 
              />
              <span className="ml-2 text-sm text-gray-700">{status.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-medium mb-2 text-sm">Active Filters:</h4>
          <div className="space-y-1">
            {searchParams.get('search') && (
              <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                Search: "{searchParams.get('search')}"
              </div>
            )}
            {searchParams.get('category') && (
              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Category: {searchParams.get('category')}
              </div>
            )}
            {searchParams.get('minPrice') && (
              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Min: ${searchParams.get('minPrice')}
              </div>
            )}
            {searchParams.get('maxPrice') && (
              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Max: ${searchParams.get('maxPrice')}
              </div>
            )}
            {searchParams.get('status') && (
              <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                Status: {searchParams.get('status')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}