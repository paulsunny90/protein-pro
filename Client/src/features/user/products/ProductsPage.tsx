import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts } from '../../../store/slice/productSlice';
import { addToCart } from '../../../store/slice/cartSlice';
import toast from 'react-hot-toast';
import type { Product } from '../../../store/slice/productSlice';
import { ShoppingCart, Star, Search, Grid, List, Heart, Package, ChevronRight } from 'lucide-react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const ProductsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { products, loading } = useAppSelector((state: any) => state.product);

  useEffect(() => {
    dispatch(fetchProducts(false));
  }, [dispatch]);

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();

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
        toast.success(`${product.name} added to cart!`);
      } catch (err: any) {
        toast.error(err || 'Failed to add to cart');
      }
    }
  };

  const categories = [
    { id: 'all', name: 'All Products', path: '/products' },
    { id: 'men', name: "Men's Collection", path: '/products/men' },
    { id: 'women', name: "Women's Collection", path: '/products/women' },
    { id: 'baby', name: 'Kids & Baby', path: '/products/baby' }
  ];

  const productTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'Foods', name: 'Foods' },
    { id: 'Supplements', name: 'Supplements' }
  ];

  const filteredProducts = products.filter((product: Product) => {
    const matchesType = selectedType === 'all' || product.productType === selectedType;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a: Product, b: Product) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const renderProductCard = (product: Product) => (
    <Link to={`/products/${product._id}`} key={product._id} className="block group animate-slide-up">
      <div className="bg-[#0d0d0d] border border-white/5 p-3 rounded-[2rem] hover:bg-[#111] transition-all h-full flex flex-col group">
        <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded-[1.8rem] bg-[#050505]">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=No+Image';
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {product.discount > 0 && (
            <div className="absolute top-4 left-4 bg-[#a3e635] text-black text-[10px] font-black px-2.5 py-1 rounded-full">
              -{product.discount}%
            </div>
          )}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white hover:text-[#a3e635] transition-all">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-2 pb-2">
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex text-[#a3e635]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-white/10'}`} />
              ))}
            </div>
            <span className="text-[10px] font-bold text-slate-600">({product.reviewCount})</span>
          </div>
          <h3 className="text-sm font-black text-white mb-1 uppercase tracking-tight line-clamp-1">{product.name}</h3>
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-black text-white">₹{product.price}</span>
            <button
              onClick={(e) => handleAddToCart(e, product)}
              className="p-2 bg-[#a3e635] text-black rounded-full hover:bg-white transition-all active:scale-95"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-2xl tracking-widest font-normal  md:text-5xl font-black mb-4 tracking-tighter uppercase leading-none">
            OUR PRODUCTS
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            Premium supplements for every fitness goal
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-16">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-600" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-[#0d0d0d] border border-white/5 rounded-2xl py-6 pl-16 pr-8 text-lg font-medium focus:outline-none focus:border-[#a3e635]/30 transition-all placeholder:text-slate-700"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="space-y-12 sticky top-8">
              {/* Category Nav */}
              <div>
                <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.2em] mb-6">CATEGORY</h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <NavLink
                      key={cat.id}
                      to={cat.path}
                      className={({ isActive }) => `
                        flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-black transition-all group
                        ${isActive
                          ? 'bg-[#a3e635] text-black shadow-xl shadow-[#a3e635]/10'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'}
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          {cat.name}
                          <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isActive ? 'text-black' : 'text-slate-700'}`} />
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Product Type Filter */}
              <div>
                <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.2em] mb-6">PRODUCT TYPE</h3>
                <div className="space-y-1">
                  {productTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`
                        w-full flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-black transition-all group
                        ${selectedType === type.id
                          ? 'bg-[#a3e635] text-black shadow-xl shadow-[#a3e635]/10'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'}
                      `}
                    >
                      {type.name}
                      <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${selectedType === type.id ? 'text-black' : 'text-slate-700'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.2em] mb-6">SORT BY</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-white/5 rounded-2xl px-6 py-4 text-sm font-black appearance-none focus:outline-none focus:border-[#a3e635]/30 cursor-pointer text-slate-400"
                >
                  <option value="featured">FEATURED FIRST</option>
                  <option value="price-low">PRICE: LOW TO HIGH</option>
                  <option value="price-high">PRICE: HIGH TO LOW</option>
                  <option value="rating">TOP RATED</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-bold text-slate-600 underline underline-offset-8 decoration-[#a3e635]/30">
                {sortedProducts.length} PRODUCTS FOUND
              </span>
              <div className="flex items-center bg-[#0d0d0d] p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#a3e635] text-black' : 'text-slate-600 hover:text-white'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#a3e635] text-black' : 'text-slate-600 hover:text-white'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-[#0d0d0d] aspect-[4/5] rounded-[2rem] border border-white/5 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-6'}>
                {sortedProducts.map(renderProductCard)}
              </div>
            )}

            {!loading && sortedProducts.length === 0 && (
              <div className="text-center py-40">
                <Package className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-white mb-2 uppercase">No matches found</h3>
                <p className="text-slate-500 font-medium">Try adjusting your filters or search query.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
