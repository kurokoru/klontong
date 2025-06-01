import { client } from '../../server';
import type { Route } from './+types/_list-products';
import { NavigationBar } from '../../components/NavigationBar';
import { ProductFilters } from '../../components/ProductFilters';
import { ProductCard } from '../../components/ProductCard';
import { Form, useSearchParams, useSubmit } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Klontong - Products' },
    { name: 'description', content: 'Browse products on Klontong marketplace' },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  // Extract filter parameters from URL
  const filters = {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    status: searchParams.get('status') as any || undefined,
    sortBy: searchParams.get('sortBy') as any || 'createdAt',
    sortOrder: searchParams.get('sortOrder') as any || 'desc',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
  };

  // Remove undefined values
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined)
  );

  const data = await client.getProducts.query(cleanFilters);
  return {
    data,
    filters: cleanFilters,
  };
}

export default function List({ loaderData }: Route.ComponentProps) {
  const { data, filters } = loaderData;
  const products = data?.products || [];
  const pagination = data?.pagination;
  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  const handleSortChange = (sortBy: string) => {
    const currentSortOrder = searchParams.get('sortOrder') || 'desc';
    const newSortOrder = searchParams.get('sortBy') === sortBy && currentSortOrder === 'desc' ? 'asc' : 'desc';
    
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('sortBy', sortBy);
    newSearchParams.set('sortOrder', newSortOrder);
    
    submit(newSearchParams, { method: 'get' });
  };

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    
    submit(newSearchParams, { method: 'get' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="text-sm">
            <span className="text-gray-500">Home</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-orange-500">Products</span>
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="flex-shrink-0">
            <ProductFilters />
          </aside>
          
          {/* Product Grid */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Products ({pagination?.total || products.length})
                {searchParams.get('search') && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    for "{searchParams.get('search')}"
                  </span>
                )}
              </h1>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select 
                  value={`${searchParams.get('sortBy') || 'createdAt'}-${searchParams.get('sortOrder') || 'desc'}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    const newSearchParams = new URLSearchParams(searchParams);
                    newSearchParams.set('sortBy', sortBy);
                    newSearchParams.set('sortOrder', sortOrder);
                    submit(newSearchParams, { method: 'get' });
                  }}
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                
                {/* View Toggle */}
                <div className="flex border border-gray-300 rounded">
                  <button className="p-2 bg-gray-100">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button className="p-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* No Results */}
            {products.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No products found</div>
                <div className="text-gray-500 text-sm">
                  Try adjusting your search or filter criteria
                </div>
              </div>
            )}
            
            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 border rounded text-sm ${
                          page === pagination.page
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}