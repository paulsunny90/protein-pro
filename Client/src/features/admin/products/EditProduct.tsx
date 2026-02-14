import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateProduct, fetchProductById } from '../../../store/slice/productSlice';
import { Package, Upload, X, Check, Activity, Zap, Heart } from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { products, loading: storeLoading } = useAppSelector((state) => state.product);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    targetGroup: 'All',
    productType: 'Supplements',
    price: '',
    isActive: true,
    calories: '0',
    protein: '0',
    carbs: '0',
    fat: '0',
    fiber: '0',
    stock: '0',
    discount: '0'
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Protein',
    'Supplements',
    'Vitamins',
    'Fitness',
    'Baby Nutrition',
    'Snacks',
    'Beverages',
  ];

  const targetGroups = [
    { id: 'Mens', label: 'Men', icon: Zap, color: 'blue' },
    { id: 'Women', label: 'Women', icon: Activity, color: 'pink' },
    { id: 'Babys', label: 'Baby', icon: Heart, color: 'emerald' },
    { id: 'All', label: 'General', icon: Package, color: 'slate' }
  ];

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      let product = products.find(p => p._id === id);

      if (!product) {
        try {
          // @ts-ignore - Assuming fetchProductById exists and returns the product
          const action = await dispatch(fetchProductById(id));
          if (fetchProductById.fulfilled.match(action)) {
            product = action.payload;
          }
        } catch (error) {
          console.error("Failed to fetch product:", error);
        }
      }

      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          brand: product.brand,
          category: product.category,
          targetGroup: product.targetGroup || 'All',
          productType: product.productType || 'Supplements',
          price: product.price.toString(),
          isActive: product.isActive,
          calories: (product.calories || 0).toString(),
          protein: (product.protein || 0).toString(),
          carbs: (product.carbs || 0).toString(),
          fat: (product.fat || 0).toString(),
          fiber: (product.fiber || 0).toString(),
          stock: (product.stock || 0).toString(),
          discount: (product.discount || 0).toString(),
        });
        // Load existing images
        if (product.images && product.images.length > 0) {
          setExistingImages(product.images);
        } else if (product.image) {
          setExistingImages([product.image]);
        }
      } else {
        // Only redirect if we definitely can't find the product
        navigate('/admin/products');
      }
    };

    loadProduct();
  }, [id, dispatch, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles: File[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB`);
        continue;
      }
      validFiles.push(file);
    }

    // Check total limit (max 5 images)
    const totalImages = existingImages.length + previewUrls.length + validFiles.length;
    if (totalImages > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formData.name.length < 3) throw new Error("Product name must be at least 3 characters long");
      if (Number(formData.price) <= 0) throw new Error("Price must be greater than 0");

      const productData = new FormData();
      productData.append('data', JSON.stringify({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        discount: Number(formData.discount),
        brand: formData.brand || 'ProteinPro',
        calories: Number(formData.calories),
        protein: Number(formData.protein),
        carbs: Number(formData.carbs),
        fat: Number(formData.fat),
        fiber: Number(formData.fiber),
        images: existingImages // Include existing images that weren't removed
      }));

      // Append new images
      selectedFiles.forEach(file => {
        productData.append('images', file);
      });

      await dispatch(
        updateProduct({ id: id!, data: productData })
      ).unwrap();

      navigate("/admin/products");
    } catch (error: any) {
      alert(error.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (storeLoading && !formData.name) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 animate-fade-in">
          <button
            onClick={() => navigate('/admin/products')}
            className="text-slate-400 hover:text-slate-600 text-sm font-semibold mb-4 flex items-center gap-2 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Edit Product</h1>
              <p className="text-lg text-slate-500 font-medium">Update details for <span className="text-slate-900 font-bold">{formData.name}</span></p>
            </div>
            {formData.isActive ? (
              <div className="px-4 py-2 bg-emerald-100/50 text-emerald-700 rounded-xl font-bold text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Listing
              </div>
            ) : (
              <div className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                Draft Mode
              </div>
            )}
          </div>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8 animate-slide-up">

            {/* Basic Details Card */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Package className="w-5 h-5" />
                </div>
                Product Details
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-indigo-100 placeholder-slate-300 transition-all"
                    placeholder="e.g. Advanced Whey Isolate"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-indigo-100 transition-all"
                      placeholder="Brand Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-indigo-100 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                    placeholder="Describe the product features and benefits..."
                  />
                </div>
              </div>
            </div>

            {/* Classification Card */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-6">Target Collection</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {targetGroups.map((group) => {
                  const Icon = group.icon;
                  const isSelected = formData.targetGroup === group.id;

                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, targetGroup: group.id }))}
                      className={`relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${isSelected
                        ? `border-${group.color}-500 bg-${group.color}-50 text-${group.color}-700`
                        : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                        }`}
                    >
                      {isSelected && (
                        <div className={`absolute top-3 right-3 w-2 h-2 rounded-full bg-${group.color}-500 animate-pulse`} />
                      )}
                      <Icon className={`w-6 h-6 ${isSelected ? `text-${group.color}-600` : 'text-slate-300'}`} />
                      <span className="text-xs font-black uppercase tracking-wider">{group.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, productType: 'Foods' }))}
                  className={`p-4 rounded-2xl border-2 font-bold transition-all ${formData.productType === 'Foods'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-100 text-slate-400'
                    }`}
                >
                  Foods
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, productType: 'Supplements' }))}
                  className={`p-4 rounded-2xl border-2 font-bold transition-all ${formData.productType === 'Supplements'
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-slate-100 text-slate-400'
                    }`}
                >
                  Supplements
                </button>
              </div>
            </div>

            {/* Nutrition Facts */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-6">Nutrition Facts (per 100g)</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {['calories', 'protein', 'carbs', 'fat', 'fiber'].map((nutrient) => (
                  <div key={nutrient}>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{nutrient}</label>
                    <input
                      type="number"
                      name={nutrient}
                      // @ts-ignore
                      value={formData[nutrient]}
                      onChange={handleChange}
                      className="w-full px-3 py-3 bg-slate-50 border-0 rounded-xl text-slate-900 font-bold text-center focus:ring-2 focus:ring-emerald-100 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Status & Pricing & Image */}
          <div className="space-y-8 animate-slide-up delay-100">

            {/* Image Upload */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <div className="mb-6 text-center">
                <h3 className="text-lg font-black text-slate-900">Product Images</h3>
                <p className="text-xs text-slate-400 mt-1">Up to 5 images (1080x1080px)</p>
              </div>

              {/* Existing Images Grid */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Current Images</p>
                  <div className="grid grid-cols-2 gap-3">
                    {existingImages.map((url, index) => (
                      <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden shadow-md group">
                        <img src={url} alt={`Existing ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-lg shadow-lg text-slate-900 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-indigo-600 text-white text-[10px] font-black rounded">
                            PRIMARY
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images Previews */}
              {previewUrls.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-emerald-500 uppercase mb-2">New Images to Upload</p>
                  <div className="grid grid-cols-2 gap-3">
                    {previewUrls.map((url, index) => (
                      <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden shadow-md group border-2 border-emerald-200">
                        <img src={url} alt={`New ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-lg shadow-lg text-slate-900 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-emerald-600 text-white text-[10px] font-black rounded">
                          NEW
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              {((existingImages.length + previewUrls.length) < 5) && (
                <label htmlFor="image-upload" className="block w-full p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all cursor-pointer text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3 mx-auto hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-600">
                    {(existingImages.length + previewUrls.length) === 0 ? 'Click to Upload Images' : `Add More (${existingImages.length + previewUrls.length}/5)`}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">Select multiple images</p>
                </label>
              )}

              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </div>


            {/* Pricing & Stock */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">
              <h3 className="text-lg font-black text-slate-900">Inventory & Pricing</h3>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl text-2xl font-black text-slate-900 focus:ring-2 focus:ring-indigo-100 transition-all font-mono"
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Stock</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Discount (%)</label>
                  <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-900" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <span className="font-bold text-slate-700">Active Status</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`w-14 h-8 rounded-full p-1 transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-all ${formData.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black tracking-wide hover:shadow-xl hover:shadow-slate-900/20 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  UPDATE PRODUCT
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;