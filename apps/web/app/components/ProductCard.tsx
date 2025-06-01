// components/ProductCard.tsx (example code)
interface Product {
  id: string;
  name: string;
  price?: number;
  imageUrl?: string;
  category?: string;
  supplier?: string;
  minOrder?: number;
  rating?: number;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
      {/* Product Image */}
      <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
        <img
          src={product.imageUrl || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        />
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
          {product.name}
        </h3>
        
        <div className="space-y-2">
          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-orange-600">
              ${product.price || 'Contact for price'}
            </span>
            {product.rating && (
              <div className="flex items-center text-yellow-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
                <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
              </div>
            )}
          </div>
          
          {/* Supplier */}
          {product.supplier && (
            <p className="text-sm text-gray-500">by {product.supplier}</p>
          )}
          
          {/* Min Order */}
          {product.minOrder && (
            <p className="text-xs text-gray-500">Min. order: {product.minOrder} pieces</p>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 bg-orange-500 text-white py-2 px-3 rounded hover:bg-orange-600 text-sm font-medium">
            Contact Supplier
          </button>
          <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}