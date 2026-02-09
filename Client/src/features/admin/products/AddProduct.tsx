import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks';
import { addProduct } from '../../../store/slice/productSlice';

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    price: '',
    isActive: true,
    calories: '0',
    protein: '0',
    carbs: '0',
    fat: '0',
    fiber: '0',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const categories = [
    'Protein',
    'Supplements',
    'Vitamins',
    'Fitness',
    'Baby Nutrition',
    'Snacks',
    'Beverages',
  ];



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

  const dispatch = useAppDispatch();

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

    try {
      // Create FormData for file upload
      const productData = new FormData();

      // Append product data as JSON string
      productData.append('data', JSON.stringify({
        ...formData,
        price: Number(formData.price),
        brand: formData.brand || 'ProteinPro',
        calories: Number(formData.calories),
        protein: Number(formData.protein),
        carbs: Number(formData.carbs),
        fat: Number(formData.fat),
        fiber: Number(formData.fiber)
      }));

      // Append image file if selected
      if (selectedFile) {
        productData.append('image', selectedFile);
      }

      await dispatch(
        addProduct(productData)
      ).unwrap();

      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (error: any) {
      console.error("API Error:", error);
      if (error.message) {
        alert(`Error: ${error.message}`);
      } else {
        alert("Failed to add product. Please check the form data and try again.");
      }
    }
  };


  const handleCancel = () => {
    navigate('/admin/products');
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Add New Product
          </h1>
          <p className="text-slate-500">Create a new product listing for your store</p>
        </header>

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
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Enter product description"
              />
            </div>

            {/* Nutritional Information */}
            <div className="mb-8 p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <h3 className="text-lg font-bold text-emerald-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Nutritional Information (per 100g)
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Calories</label>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Protein (g)</label>
                  <input
                    type="number"
                    name="protein"
                    value={formData.protein}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Carbs (g)</label>
                  <input
                    type="number"
                    name="carbs"
                    value={formData.carbs}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Fat (g)</label>
                  <input
                    type="number"
                    name="fat"
                    value={formData.fat}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Fiber (g)</label>
                  <input
                    type="number"
                    name="fiber"
                    value={formData.fiber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
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
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;