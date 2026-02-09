import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts } from '../../../store/slice/productSlice';
import { addToCart } from '../../../store/slice/cartSlice';
import type { Product } from '../../../store/slice/productSlice';
import { ShoppingCart, Star, Filter, Grid, List, Heart, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const ProductsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { products } = useAppSelector((state: any) => state.product);

  useEffect(() => {
    dispatch(fetchProducts(false));
  }, [dispatch]);

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigation to details page

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (product._id) {
      try {
        await dispatch(addToCart({
          productId: product._id,
          quantity: 1,
          size: 'Medium'
        })).unwrap();
        alert(`${product.name} added to cart!`);
      } catch (err: any) {
        alert(err || 'Failed to add to cart');
      }
    }
  };

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
    : products.filter((product: Product) => product.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a: Product, b: Product) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured/default
  });


  const renderProductCard = (product: Product) => (
    <Link to={`/products/${product._id}`} key={product._id} className="block group animate-slide-up">
      <div className="soft-card p-3 h-full flex flex-col soft-card-hover border-none">
        <div className="relative aspect-square mb-6 overflow-hidden rounded-[1.8rem]">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=No+Image';
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2.5 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-100 hover:text-emerald-500 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </div>
          {product.discount > 0 && (
            <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg">
              -{product.discount}%
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-slate-900 text-[10px] font-black uppercase tracking-[0.2em]">Fully Committed</span>
            </div>
          )}
        </div>
        <div className="px-3 pb-3 flex-grow flex flex-col">
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex space-x-0.5 text-emerald-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'}`} />
              ))}
            </div>
            <span className="text-[10px] font-black text-slate-400">({product.reviewCount})</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight group-hover:text-emerald-600 transition-colors">{product.name}</h3>
          <p className="text-xs text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed">{product.description}</p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900 leading-none">${product.price}</span>
            </div>
            <button
              onClick={(e) => handleAddToCart(e, product)}
              className={`p-3 rounded-2xl transition-all active:scale-95 shadow-lg ${product.inStock
                ? 'bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );

  const renderProductListItem = (product: Product) => (
    <Link to={`/products/${product._id}`} key={product._id} className="block group mb-8 animate-slide-up">
      <div className="soft-card p-4 soft-card-hover border-none flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 aspect-square overflow-hidden rounded-[1.8rem] shrink-0">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=No+Image';
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <div className="flex-grow flex flex-col py-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-0.5 text-emerald-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'}`} />
                ))}
              </div>
              <span className="text-xs font-black text-slate-400">({product.reviewCount} Reviews)</span>
            </div>
            {product.discount > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg">
                SAVE {product.discount}%
              </span>
            )}
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
          <p className="text-slate-500 font-medium leading-relaxed max-w-2xl mb-6">{product.description}</p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-black text-slate-900">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-slate-300 line-through font-bold">${product.originalPrice}</span>
              )}
            </div>
            <button
              onClick={(e) => handleAddToCart(e, product)}
              className={`flex items-center space-x-3 px-8 py-3.5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg ${product.inStock
                ? 'bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{product.inStock ? 'Add to Cart' : 'Sold Out'}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            <Package className="h-3 w-3" />
            <span>High Performance Nutrition</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">Premium Collection</h1>
          <div className="w-16 h-1.5 bg-emerald-500 mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Biotechnologically perfected supplements engineered for your individual physiological demands.
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="soft-card p-4 mb-12 border-none">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Filter By</span>
              <div className="flex items-center bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer pr-10"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <div className="bg-white p-1 rounded-lg shadow-sm -ml-8 pointer-events-none">
                  <Filter className="w-3 h-3 text-emerald-500" />
                </div>
              </div>

              <div className="flex items-center bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer pr-10"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <div className="bg-white p-1 rounded-lg shadow-sm -ml-8 pointer-events-none">
                  <Filter className="w-3 h-3 text-emerald-500" />
                </div>
              </div>
            </div>

            <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'w-full'}>
          {sortedProducts.map((product: Product) => (
            viewMode === 'grid'
              ? renderProductCard(product)
              : renderProductListItem(product)
          ))}
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-32 animate-fade-in">
            <div className="bg-emerald-50 w-24 h-24 mx-auto mb-8 rounded-[2rem] flex items-center justify-center">
              <Package className="w-10 h-10 text-emerald-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">No scientific match found</h3>
            <p className="text-slate-500 font-medium">Try adjusting your filters to find your ideal nutrition solution.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
