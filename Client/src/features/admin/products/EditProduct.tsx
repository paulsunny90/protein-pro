import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  CreditCard, 
  UserCircle,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateProduct } from '../../../store/slice/productSlice';

interface Product {
  _id?: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.product);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    price: '',
    isActive: true,
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

  const nav = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Users', icon: UserCircle, path: '/UserManagement' },
    { label: 'Products', icon: Package, path: '/ProductDashboard' },
    { label: 'Orders', icon: ShoppingCart, path: '/OrdersPage' },
    { label: 'Subscriptions', icon: CreditCard, path: '/SubscriptionPage' },
    { label: 'Settings', icon: DollarSign, path: '/Settings' },
  ];

  // Find the product to edit
  useEffect(() => {
    if (id) {
      const productToEdit = products.find(p => p._id === id);
      if (productToEdit) {
        setFormData({
          name: productToEdit.name,
          description: productToEdit.description,
          brand: productToEdit.brand,
          category: productToEdit.category,
          price: productToEdit.price.toString(),
          isActive: productToEdit.isActive,
        });
        if (productToEdit.imageUrl) {
          setPreviewUrl(`http://localhost:5000${productToEdit.imageUrl}`);
        }
      } else {
        // If product not found in store, you might want to fetch it
        // For now, redirect to dashboard
        navigate('/ProductDashboard');
      }
    }
  }, [id, products, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      brand: e.target.value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    // Clear the file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (formData.name.length < 3) {
      alert("Product name must be at least 3 characters long");
      return;
    }
    
    if (formData.description.length < 5) {
      alert("Description must be at least 5 characters long");
      return;
    }
    
    if (formData.brand.length < 1) {
      alert("Brand is required");
      return;
    }
    
    if (formData.category.length < 1) {
      alert("Category is required");
      return;
    }
    
    if (Number(formData.price) <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    setIsSubmitting(true);

    try {
      if (selectedFile) {
        // Create FormData for file upload
        const productData = new FormData();
        
        // Append product data as JSON string
        productData.append('data', JSON.stringify({
          ...formData,
          price: Number(formData.price),
          brand: formData.brand || 'ProteinPro'
        }));
        
        // Append image file if selected
        productData.append('image', selectedFile);

        await dispatch(
          updateProduct({ id: id!, data: productData })
        ).unwrap();
      } else {
        // Regular JSON update
        const updateData = {
          ...formData,
          price: Number(formData.price),
          brand: formData.brand || 'ProteinPro'
        } as Product;

        await dispatch(
          updateProduct({ id: id!, data: updateData })
        ).unwrap();
      }

      alert("Product updated successfully!");
      navigate("/ProductDashboard");
    } catch (error: any) {
      console.error("API Error:", error);
      if (error.message) {
        alert(`Error: ${error.message}`);
      } else {
        alert("Failed to update product. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/ProductDashboard');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white hidden md:flex flex-col shadow-2xl">
        <div className="px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <p className="text-slate-400 text-sm">Product Management</p>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {nav.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all duration-300 hover:translate-x-1 ${
                window.location.pathname === item.path
                  ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-white border border-indigo-500/30 shadow-lg'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${window.location.pathname === item.path ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                <item.icon className="w-5 h-5" />
              </div>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Edit Product
              </h1>
              <p className="text-slate-500">Update your product details</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold cursor-pointer hover:scale-105 transition-transform">
              A
            </div>
          </div>
        </header>

        <main className="p-6 flex-1">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Brand *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleBrandChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter brand name"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Status
                    </label>
                    <select
                      name="isActive"
                      value={formData.isActive ? "true" : "false"}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        isActive: e.target.value === "true"
                      }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter product description"
                  />
                </div>

                {/* Images Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Product Images
                  </label>
                  
                  {/* Preview Area */}
                  {previewUrl && (
                    <div className="mb-4 relative inline-block">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg border-2 border-slate-200 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-xs font-bold"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors">
                    <div className="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <p className="text-slate-500 mb-2">Drag and drop images here, or click to browse</p>
                      <p className="text-sm text-slate-400 mb-4">Supports JPG, PNG, SVG up to 5MB</p>
                      
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <button 
                        type="button" 
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors"
                      >
                        {selectedFile ? 'Change Image' : 'Select Files'}
                      </button>
                      
                      {selectedFile && (
                        <p className="mt-2 text-sm text-green-600">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditProduct;