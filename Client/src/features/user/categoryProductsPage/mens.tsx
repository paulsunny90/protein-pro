import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts } from '../../../store/slice/productSlice';
import { addToCart } from '../../../store/slice/cartSlice';
import type { Product } from '../../../store/slice/productSlice';
import { ShoppingCart, Star, Filter, Grid, List, Heart, Package } from 'lucide-react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const MenProductsPage = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedType, setSelectedType] = useState('All');
    const [sortBy, setSortBy] = useState('featured');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { products, loading } = useAppSelector((state: any) => state.product);

    useEffect(() => {
        console.log('Men Products Page - Fetching all products...');
        dispatch(fetchProducts(true));
    }, [dispatch]);

    useEffect(() => {
        console.log('Men Products Page - Total products:', products.length);
        console.log('Men Products Page - Products data:', products);
    }, [products]);

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
                alert(`${product.name} added to cart!`);
            } catch (err: any) {
                alert(err || 'Failed to add to cart');
            }
        }
    };

    const menProducts = products.filter((p: Product) => p.targetGroup === 'Mens');
    console.log('Men Products Page - Filtered men products:', menProducts.length);

    const filteredProducts = selectedType === 'All'
        ? menProducts
        : menProducts.filter((product: Product) => product.productType === selectedType);

    const sortedProducts = [...filteredProducts].sort((a: Product, b: Product) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
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

    const base = "px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all duration-300";
    const active = "bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100 scale-105";
    const inactive = "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50";

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-20 animate-fade-in">
                    <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                        <Package className="h-3 w-3" />
                        <span>Peak Performance</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">Men's Collection</h1>
                    <div className="w-16 h-1.5 bg-emerald-500 mx-auto rounded-full mb-8"></div>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                        Advanced formulations engineered to optimize male physiology and performance.
                    </p>
                </div>

                {/* Category Navbar */}
                <div className="flex justify-center mb-12 animate-fade-in delay-100">
                    <div className="inline-flex bg-slate-100/50 backdrop-blur-sm p-1.5 rounded-full border border-slate-200/50">
                        <NavLink
                            to="/products/men"
                            className={({ isActive }) =>
                                `${base} ${isActive ? active : inactive}`
                            }
                        >
                            MEN
                        </NavLink>

                        <NavLink
                            to="/products/women"
                            className={({ isActive }) =>
                                `${base} ${isActive ? active : inactive}`
                            }
                        >
                            WOMEN
                        </NavLink>

                        <NavLink
                            to="/products/baby"
                            className={({ isActive }) =>
                                `${base} ${isActive ? active : inactive}`
                            }
                        >
                            KIDS
                        </NavLink>
                    </div>
                </div>

                {/* Filters and Sorting */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 px-4">
                    <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-full shadow-sm border border-slate-100">
                        <div className="bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Type
                        </div>

                        <div className="relative group">
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="appearance-none bg-transparent pl-4 pr-10 py-2 text-sm font-bold text-slate-600 focus:outline-none cursor-pointer hover:text-emerald-600 transition-colors"
                            >
                                <option value="All">All Types</option>
                                <option value="Foods">Foods</option>
                                <option value="Supplements">Supplements</option>
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-emerald-500 transition-colors">
                                <Filter className="w-3 h-3" />
                            </div>
                        </div>

                        <div className="w-px h-6 bg-slate-200"></div>

                        <div className="relative group">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-transparent pl-4 pr-10 py-2 text-sm font-bold text-slate-600 focus:outline-none cursor-pointer hover:text-emerald-600 transition-colors"
                            >
                                <option value="featured">Featured First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-emerald-500 transition-colors">
                                <Filter className="w-3 h-3" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-3 rounded-xl transition-all duration-300 ${viewMode === 'grid'
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-3 rounded-xl transition-all duration-300 ${viewMode === 'list'
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-32 animate-fade-in">
                        <div className="bg-emerald-50 w-24 h-24 mx-auto mb-8 rounded-[2rem] flex items-center justify-center animate-pulse">
                            <Package className="w-10 h-10 text-emerald-500 animate-bounce" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Loading Products...</h3>
                        <p className="text-slate-500 font-medium">Please wait while we fetch the latest products.</p>
                    </div>
                )}

                {/* Products Grid/List */}
                {!loading && (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'w-full'}>
                        {sortedProducts.map((product: Product) => (
                            viewMode === 'grid'
                                ? renderProductCard(product)
                                : renderProductListItem(product)
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && sortedProducts.length === 0 && (
                    <div className="text-center py-32 animate-fade-in">
                        <div className="bg-emerald-50 w-24 h-24 mx-auto mb-8 rounded-[2rem] flex items-center justify-center">
                            <Package className="w-10 h-10 text-emerald-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">No match found</h3>
                        <p className="text-slate-500 font-medium">No products available in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenProductsPage;
