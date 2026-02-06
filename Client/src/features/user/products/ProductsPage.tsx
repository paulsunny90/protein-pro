import React, { useState } from 'react';
import { ShoppingCart, Star, Filter, Grid, List, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Mock product data
  const products = [
    {
      id: 1,
      name: 'Premium Whey Protein',
      price: 49.99,
      originalPrice: 59.99,
      discount: 17,
      rating: 4.5,
      reviewCount: 128,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'proteins',
      inStock: true,
      description: 'High-quality whey protein isolate with 25g protein per serving'
    },
    {
      id: 2,
      name: 'Plant-Based Protein Blend',
      price: 39.99,
      originalPrice: 49.99,
      discount: 20,
      rating: 4.3,
      reviewCount: 96,
      image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'proteins',
      inStock: true,
      description: 'Vegan-friendly protein blend with all essential amino acids'
    },
    {
      id: 3,
      name: 'BCAA Amino Acids',
      price: 29.99,
      originalPrice: 34.99,
      discount: 14,
      rating: 4.7,
      reviewCount: 78,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'amino-acids',
      inStock: true,
      description: 'Branched-chain amino acids for muscle recovery and growth'
    },
    {
      id: 4,
      name: 'Creatine Monohydrate',
      price: 24.99,
      originalPrice: 29.99,
      discount: 17,
      rating: 4.6,
      reviewCount: 142,
      image: 'https://images.unsplash.com/photo-1625772440111-9eac1da1a2c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'strength',
      inStock: false,
      description: 'Pure creatine monohydrate for improved strength and power'
    },
    {
      id: 5,
      name: 'Pre-Workout Booster',
      price: 34.99,
      originalPrice: 39.99,
      discount: 13,
      rating: 4.4,
      reviewCount: 89,
      image: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'energy',
      inStock: true,
      description: 'Energy and focus supplement for intense workouts'
    },
    {
      id: 6,
      name: 'Post-Workout Recovery',
      price: 32.99,
      originalPrice: 37.99,
      discount: 13,
      rating: 4.2,
      reviewCount: 67,
      image: 'https://images.unsplash.com/photo-1590421312654-af5e646ec9be?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'recovery',
      inStock: true,
      description: 'Recovery formula with protein and carbohydrates'
    },
    {
      id: 7,
      name: 'Multivitamin Complex',
      price: 27.99,
      originalPrice: 32.99,
      discount: 15,
      rating: 4.8,
      reviewCount: 156,
      image: 'https://images.unsplash.com/photo-1570485071660-8d4f60337c64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'vitamins',
      inStock: true,
      description: 'Complete multivitamin with essential nutrients'
    },
    {
      id: 8,
      name: 'Fish Oil Omega-3',
      price: 19.99,
      originalPrice: 24.99,
      discount: 20,
      rating: 4.5,
      reviewCount: 112,
      image: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'omega-3',
      inStock: true,
      description: 'High-potency omega-3 fatty acids for heart health'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'proteins', name: 'Proteins' },
    { id: 'amino-acids', name: 'Amino Acids' },
    { id: 'strength', name: 'Strength' },
    { id: 'energy', name: 'Energy' },
    { id: 'recovery', name: 'Recovery' },
    { id: 'vitamins', name: 'Vitamins' },
    { id: 'omega-3', name: 'Omega-3' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured/default
  });

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 text-yellow-400 fill-current" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return <div className="flex">{stars}</div>;
  };

  const renderProductCard = (product: any) => (
    <Link to={`/products/${product.id}`} key={product.id} className="block group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          {product.discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{product.discount}%
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold">OUT OF STOCK</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
          <div className="flex items-center mb-2">
            {renderStars(product.rating)}
            <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
              )}
            </div>
            <button 
              className={`p-2 rounded-lg ${
                product.inStock 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );

  const renderProductListItem = (product: any) => (
    <Link to={`/products/${product.id}`} key={product.id} className="block group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-4">
        <div className="flex">
          <div className="w-1/4 relative">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
              <Heart className="w-4 h-4 text-gray-600" />
            </button>
            {product.discount > 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{product.discount}%
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-bold">OUT OF STOCK</span>
              </div>
            )}
          </div>
          <div className="w-3/4 p-4">
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
            <div className="flex items-center mb-2">
              {renderStars(product.rating)}
              <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-gray-900">${product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
                )}
              </div>
              <button 
                className={`p-2 rounded-lg ${
                  product.inStock 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nutrition Products</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our premium selection of nutrition supplements designed to fuel your fitness journey
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'w-full'}>
          {sortedProducts.map(product => 
            viewMode === 'grid' 
              ? renderProductCard(product) 
              : renderProductListItem(product)
          )}
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;