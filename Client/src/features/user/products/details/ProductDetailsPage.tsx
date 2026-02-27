import { useState, useEffect } from 'react';
import { Star, ShoppingCart, Shield, Truck, RotateCcw, StarHalf, Loader2, ArrowLeft, CheckCircle2, Zap, Activity, Minus, Plus, MessageSquare } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchProductById, createProductReview } from '../../../../store/slice/productSlice';
import { addToCart } from '../../../../store/slice/cartSlice';
import toast from 'react-hot-toast';

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const dispatch = useAppDispatch();

  const { products, loading: productLoading, error: productError } = useAppSelector((state) => state.product);
  const product = products.find(p => p._id === id);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (product?._id) {
      try {
        await dispatch(addToCart({
          productId: product._id,
          quantity,
          size: selectedSize
        })).unwrap();
        toast.success(`${product.name} added to cart!`);
      } catch (err: any) {
        toast.error(err || 'Failed to add to cart');
      }
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (product?._id) {
      try {
        await dispatch(addToCart({
          productId: product._id,
          quantity,
          size: selectedSize
        })).unwrap();
        navigate('/order');
      } catch (err: any) {
        console.error("Failed to add to cart:", err);
        navigate('/order');
      }
    }
  };

  const submitReviewHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) {
      toast.error('Please enter a comment');
      return;
    }

    setSubmittingReview(true);
    try {
      await dispatch(createProductReview({
        productId: id!,
        rating,
        comment
      })).unwrap();
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      dispatch(fetchProductById(id!)); // Refresh product data
    } catch (err: any) {
      toast.error(err || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 text-[#a3e635] fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-5 h-5 text-[#a3e635] fill-current" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-white/10" />);
    }

    return <div className="flex space-x-1">{stars}</div>;
  };

  if (productLoading && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 text-[#a3e635] animate-spin" />
      </div>
    );
  }

  if (productError && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center p-8 bg-[#111] rounded-[2.5rem] border border-white/5">
          <h2 className="text-3xl font-black text-white mb-4">PRODUCT NOT FOUND</h2>
          <p className="text-slate-400 mb-8 font-medium">{productError}</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center text-[#a3e635] hover:text-white font-black uppercase tracking-widest text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return To Collection
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const displayProduct = {
    ...product,
    originalPrice: product.originalPrice || product.price * 1.2,
    discount: product.discount || 15,
    rating: product.rating || 0,
    reviewCount: product.numReviews || product.reviews?.length || 0,
    features: [
      '25g Pharmaceutical-Grade Protein',
      'Zero Artificial Sweeteners',
      'Optimized BCAA Profile (8:1:1)',
      'Clinically Tested Bio-Availability',
      'Advanced Enzyme Complex',
      'Keto-Friendly Metabolism support'
    ],
    sizes: ['1KG', '2KG', '4KG'],
    flavors: ['Shadow Vanilla', 'Midnight Chocolate', 'Neon Berry'],
    images: (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    ]),
    nutritionalInfo: {
      calories: product.calories || 120,
      protein: product.protein || 25,
      carbs: product.carbs || 2,
      fat: product.fat || 1.5,
      fiber: product.fiber || 0,
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link to="/" className="text-slate-500 hover:text-[#a3e635] text-xs font-black uppercase tracking-widest transition-colors">Home</Link>
            </li>
            <li className="flex items-center">
              <span className="text-slate-800 mx-2">/</span>
              <Link to="/products" className="text-slate-500 hover:text-[#a3e635] text-xs font-black uppercase tracking-widest transition-colors">Products</Link>
            </li>
            <li className="flex items-center">
              <span className="text-slate-800 mx-2">/</span>
              <span className="text-[#a3e635] text-xs font-black uppercase tracking-widest">{displayProduct.name}</span>
            </li>
          </ol>
        </nav>

        {/* Product Details Container */}
        <div className="bg-[#0d0d0d] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Images */}
            <div className="p-8 lg:p-12 bg-black flex flex-col items-center justify-center border-r border-white/5">
              <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden bg-[#0d0d0d] border border-white/5 group">
                <img
                  src={displayProduct.images[mainImageIndex] || displayProduct.images[0]}
                  alt={displayProduct.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-6 left-6 bg-[#a3e635] text-black text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter">
                  -{displayProduct.discount}% OFF
                </div>
              </div>

              {/* Secondary Images */}
              <div className="grid grid-cols-4 gap-4 mt-8 w-full">
                {displayProduct.images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setMainImageIndex(index)}
                    className={`aspect-square bg-black border rounded-2xl overflow-hidden transition-colors cursor-pointer ${mainImageIndex === index ? 'border-[#a3e635]' : 'border-white/5 hover:border-[#a3e635]/50'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${displayProduct.name} ${index + 1}`}
                      className={`w-full h-full object-cover transition-opacity ${mainImageIndex === index ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                        }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-16 flex flex-col">
              <div className="inline-flex items-center space-x-2 text-[#a3e635] mb-6">
                <Zap className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">ELITE SERIES ALPHA</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tighter leading-tight">{displayProduct.name}</h1>

              <div className="flex items-center mb-8 pb-8 border-b border-white/5">
                <div className="flex items-center mr-4">
                  {renderStars(displayProduct.rating)}
                </div>
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">({displayProduct.reviewCount} Verified Athletes)</span>
              </div>

              <div className="flex items-center mb-10">
                <div className="flex flex-col">
                  <span className="text-5xl font-black text-white">₹{displayProduct.price}</span>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-slate-500 line-through font-bold">₹{displayProduct.originalPrice.toFixed(0)}</span>
                    <span className="text-[#a3e635] text-xs font-black uppercase tracking-widest">Saving Revealed</span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10">{displayProduct.description}</p>

              {/* Size Selection */}
              <div className="mb-10">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">SELECT DOSAGE SIZE</h3>
                <div className="flex flex-wrap gap-3">
                  {displayProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-8 py-3 rounded-xl font-black text-sm transition-all duration-300 ${selectedSize === size
                        ? 'bg-[#a3e635] text-black shadow-lg shadow-[#a3e635]/10 scale-105'
                        : 'bg-white/5 text-slate-400 border border-white/5 hover:border-[#a3e635]/30'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flavor Selection */}
              <div className="mb-12">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">CHOOSE FLAVOR PROFILE</h3>
                <div className="flex flex-wrap gap-3">
                  {displayProduct.flavors.map((flavor) => (
                    <button
                      key={flavor}
                      className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl font-black text-xs text-slate-400 hover:text-white hover:border-[#a3e635]/30 transition-all"
                    >
                      {flavor}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="mb-12">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">QUANTITY</h3>
                <div className="flex items-center space-x-4 bg-white/5 border border-white/5 w-fit rounded-2xl p-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-xl font-black text-white w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 mt-auto">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white text-black py-5 px-8 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center shadow-xl"
                >
                  <ShoppingCart className="h-5 w-5 mr-3" />
                  ADD TO CART
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#a3e635] text-black py-5 px-8 rounded-2xl font-black text-lg hover:bg-[#b4f04a] transition-all active:scale-95 shadow-xl shadow-[#a3e635]/10"
                >
                  CHECKOUT
                </button>
              </div>
            </div>
          </div>

          {/* Performance Specs */}
          <div className="bg-[#111] border-t border-white/5 p-12">
            <h2 className="text-3xl font-black text-white mb-10 tracking-tight flex items-center">
              <Activity className="mr-4 text-[#a3e635] w-8 h-8" />
              PERFORMANCE SPECS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { label: 'Calories', val: displayProduct.nutritionalInfo.calories, color: '#a3e635' },
                { label: 'Protein', val: `${displayProduct.nutritionalInfo.protein}G`, color: '#a3e635' },
                { label: 'Carbs', val: `${displayProduct.nutritionalInfo.carbs}G`, color: '#a3e635' },
                { label: 'Fat', val: `${displayProduct.nutritionalInfo.fat}G`, color: '#a3e635' },
                { label: 'Fiber', val: `${displayProduct.nutritionalInfo.fiber}G`, color: '#a3e635' }
              ].map((item, idx) => (
                <div key={idx} className="bg-black/40 border border-white/5 p-8 rounded-3xl text-center group hover:border-[#a3e635]/30 transition-all">
                  <div className="text-3xl font-black text-white mb-2 group-hover:text-[#a3e635] transition-colors">{item.val}</div>
                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">{item.label}</div>
                  <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#a3e635]/40" style={{ width: '70%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="p-12 border-t border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {displayProduct.features.map((feature, index) => (
                <div key={index} className="flex items-center group">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#a3e635]/10 rounded-xl flex items-center justify-center mr-5 border border-[#a3e635]/20 group-hover:bg-[#a3e635]/20 transition-all">
                    <CheckCircle2 className="h-5 w-5 text-[#a3e635]" />
                  </div>
                  <span className="text-slate-300 font-bold group-hover:text-white transition-colors">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div className="p-12 border-t border-white/5 bg-[#080808]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Review Summary & Form */}
              <div className="lg:col-span-1">
                <h2 className="text-3xl font-black text-white mb-6 tracking-tight flex items-center">
                  <MessageSquare className="mr-4 text-[#a3e635] w-8 h-8" />
                  REVIEWS
                </h2>

                <div className="bg-black/30 border border-white/5 p-8 rounded-[2rem] mb-8">
                  <div className="text-5xl font-black text-[#a3e635] mb-2">{displayProduct.rating.toFixed(1)}</div>
                  <div className="mb-4">{renderStars(displayProduct.rating)}</div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Based on {displayProduct.reviewCount} reviews</p>
                </div>

                {isAuthenticated ? (
                  <div className="bg-[#111] border border-white/5 p-8 rounded-[2rem]">
                    <h3 className="text-white font-black uppercase tracking-widest text-sm mb-6">Write a Review</h3>
                    <form onSubmit={submitReviewHandler} className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Rating</label>
                        <select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="w-full bg-black border border-white/10 rounded-xl p-4 text-white font-bold focus:border-[#a3e635] transition-colors outline-none cursor-pointer"
                        >
                          <option value="5">5 - Excellent</option>
                          <option value="4">4 - Very Good</option>
                          <option value="3">3 - Good</option>
                          <option value="2">2 - Fair</option>
                          <option value="1">1 - Poor</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Comment</label>
                        <textarea
                          rows={4}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your experience with this product..."
                          className="w-full bg-black border border-white/10 rounded-xl p-4 text-white font-medium focus:border-[#a3e635] transition-colors outline-none resize-none"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="w-full bg-[#a3e635] text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#b4f049] transition-all disabled:opacity-50"
                      >
                        {submittingReview ? 'Submitting...' : 'Post Review'}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="bg-[#111] border border-white/5 p-8 rounded-[2rem] text-center">
                    <p className="text-slate-400 font-bold mb-4">Please log in to write a review</p>
                    <Link to="/login" className="text-[#a3e635] font-black uppercase tracking-widest text-xs hover:text-white transition-colors">Log In Now →</Link>
                  </div>
                )}
              </div>

              {/* Review List */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev: any, index: number) => (
                      <div key={index} className="bg-black/20 border border-white/5 p-8 rounded-[2rem] hover:border-white/10 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-white font-black text-lg tracking-tight mb-1">{rev.name}</h4>
                            <div className="flex items-center space-x-3">
                              {renderStars(rev.rating)}
                              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                {new Date(rev.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {rev.user === user?._id && (
                            <span className="text-[8px] bg-[#a3e635]/10 text-[#a3e635] border border-[#a3e635]/20 px-2 py-1 rounded font-black tracking-widest uppercase">Your Review</span>
                          )}
                        </div>
                        <p className="text-slate-400 font-medium leading-relaxed italic">"{rev.comment}"</p>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center py-12 text-center bg-black/10 border border-dashed border-white/5 rounded-[2.5rem]">
                      <MessageSquare className="w-12 h-12 text-white/5 mb-4" />
                      <p className="text-slate-500 font-bold">No reviews yet. Be the first to share your intensity!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security & Logistics */}
          <div className="bg-black p-12 border-t border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex items-center group">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mr-6 border border-white/5 group-hover:border-[#a3e635]/30 transition-all">
                  <Truck className="h-7 w-7 text-[#a3e635]" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm uppercase tracking-widest mb-1">Elite Logistics</h3>
                  <p className="text-xs text-slate-500 font-medium">Free global transit on $50+ orders</p>
                </div>
              </div>
              <div className="flex items-center group">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mr-6 border border-white/5 group-hover:border-[#a3e635]/30 transition-all">
                  <RotateCcw className="h-7 w-7 text-[#a3e635]" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm uppercase tracking-widest mb-1">Combat Returns</h3>
                  <p className="text-xs text-slate-500 font-medium">30-day tactical return window</p>
                </div>
              </div>
              <div className="flex items-center group">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mr-6 border border-white/5 group-hover:border-[#a3e635]/30 transition-all">
                  <Shield className="h-7 w-7 text-[#a3e635]" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm uppercase tracking-widest mb-1">Encrypted Sec</h3>
                  <p className="text-xs text-slate-500 font-medium">Military-grade checkout security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
