import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, Home, CheckCircle, X, User, Phone, Loader2, Mail } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    fetchAddresses,
    addAddress,
    editAddress,
    removeAddress,
    markAsDefault,
    clearAddressError,
    setError as setAddressError
} from '../../../store/slice/addressSlice';
import type { Address } from '../../../services/addressService';

const SavedAddressesPage = () => {
    const dispatch = useAppDispatch();
    const { addresses, loading, error } = useAppSelector((state) => state.address);

    const [submitting, setSubmitting] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Address>>({
        label: 'Home',
        firstName: '',
        lastName: '',
        email: '',
        houseNoOrName: '',
        phone: '',
        street: '',
        landmark: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false
    });

    // Fetch addresses on component mount
    useEffect(() => {
        dispatch(fetchAddresses());
    }, [dispatch]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone ||
            !formData.street || !formData.city || !formData.state ||
            !formData.postalCode || !formData.country) {
            dispatch(setAddressError('Please fill in all required fields.'));
            return;
        }

        try {
            setSubmitting(true);
            if (editingId) {
                await dispatch(editAddress({ id: editingId, data: formData })).unwrap();
            } else {
                await dispatch(addAddress(formData)).unwrap();
            }

            // Close form and reset
            setShowAddForm(false);
            setEditingId(null);
            resetForm();
        } catch (err: any) {
            console.error('Error saving address:', err);
            dispatch(setAddressError(err.message || err || 'Failed to save address'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (address: Address) => {
        setEditingId(address._id || null);
        setFormData({
            firstName: address.firstName,
            lastName: address.lastName,
            email: address.email,
            houseNoOrName: address.houseNoOrName,
            phone: address.phone,
            street: address.street,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            isDefault: address.isDefault
        });
        setShowAddForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this address?')) {
            return;
        }
        dispatch(removeAddress(id));
    };

    const handleSetDefault = async (id: string) => {
        dispatch(markAsDefault(id));
    };

    const resetForm = () => {
        setFormData({
            label: 'Home',
            firstName: '',
            lastName: '',
            email: '',
            houseNoOrName: '',
            phone: '',
            street: '',
            landmark: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'India',
            isDefault: false
        });
        setEditingId(null);
        dispatch(clearAddressError());
    };

    const handleCloseForm = () => {
        setShowAddForm(false);
        resetForm();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 animate-fade-in flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Saved Addresses</h1>
                        <p className="text-lg text-gray-500">Manage your delivery addresses</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Address
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={() => dispatch(clearAddressError())}><X className="w-4 h-4" /></button>
                    </div>
                )}

                {/* Loading State */}
                {loading && !showAddForm && (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    </div>
                )}

                {/* Add/Edit Address Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex justify-between items-center rounded-t-3xl">
                                <h2 className="text-2xl font-bold text-gray-900">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
                                <button
                                    onClick={handleCloseForm}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-600" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-8">
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Address Label (e.g. Home, Office)</label>
                                    <div className="flex gap-4">
                                        {['Home', 'Office', 'Other'].map((l) => (
                                            <button
                                                key={l}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, label: l }))}
                                                className={`px-6 py-2 rounded-xl font-bold transition-all ${formData.label === l ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                            >
                                                {l}
                                            </button>
                                        ))}
                                        {formData.label !== 'Home' && formData.label !== 'Office' && formData.label !== 'Other' && (
                                            <input
                                                type="text"
                                                value={formData.label || ''}
                                                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none"
                                                placeholder="Custom Label"
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, label: '' }))}
                                            className={`px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all ${(formData.label !== 'Home' && formData.label !== 'Office' && formData.label !== 'Other') ? 'hidden' : ''}`}
                                        >
                                            Custom
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName || ''}
                                                onChange={handleInputChange}
                                                placeholder="John"
                                                required
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName || ''}
                                                onChange={handleInputChange}
                                                placeholder="Doe"
                                                required
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email || ''}
                                                onChange={handleInputChange}
                                                placeholder="john@example.com"
                                                required
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone || ''}
                                                onChange={handleInputChange}
                                                placeholder="1234567890"
                                                required
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">House No. / Name (Optional)</label>
                                    <div className="relative">
                                        <Home className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="houseNoOrName"
                                            value={formData.houseNoOrName || ''}
                                            onChange={handleInputChange}
                                            placeholder="Apt 4B"
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="street"
                                                value={formData.street || ''}
                                                onChange={handleInputChange}
                                                placeholder="123 Main St"
                                                required
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Landmark (Optional)</label>
                                        <input
                                            type="text"
                                            name="landmark"
                                            value={formData.landmark || ''}
                                            onChange={handleInputChange}
                                            placeholder="Near City Mall"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city || ''}
                                            onChange={handleInputChange}
                                            placeholder="New York"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state || ''}
                                            onChange={handleInputChange}
                                            placeholder="NY"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Pincode</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode || ''}
                                            onChange={handleInputChange}
                                            placeholder="400001"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option>India</option>
                                            <option>United States</option>
                                            <option>Canada</option>
                                            <option>United Kingdom</option>
                                            <option>Australia</option>
                                            <option>Germany</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name="isDefault"
                                            checked={formData.isDefault}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className="ml-3 text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                                            Set as default address
                                        </span>
                                    </label>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseForm}
                                        className="flex-1 py-3 px-6 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                                    >
                                        {submitting ? 'Saving...' : 'Save Address'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Addresses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <div key={address._id} className="soft-card p-6 relative hover:shadow-xl transition-all duration-300 animate-fade-in">
                            {address.isDefault && (
                                <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Default
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-blue-100 p-2 rounded-xl text-blue-600 h-fit">
                                    {address.label?.toLowerCase() === 'home' ? <Home className="w-5 h-5" /> :
                                        address.label?.toLowerCase() === 'office' ? <Plus className="w-5 h-5 rotate-45" /> : <MapPin className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 capitalize flex items-center gap-2">
                                        {address.label || 'Address'}
                                        {address.isDefault && (
                                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest">Default</span>
                                        )}
                                    </h3>
                                    <p className="text-sm text-gray-500">{address.firstName} {address.lastName}</p>
                                    <div className="flex items-center text-sm text-gray-500 mt-2">
                                        <Mail className="w-3.5 h-3.5 mr-2" />
                                        {address.email}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Phone className="w-3.5 h-3.5 mr-2" />
                                        {address.phone}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6 text-gray-700 space-y-0.5">
                                <p className="font-bold text-slate-800">{address.houseNoOrName && `${address.houseNoOrName}, `}{address.street}</p>
                                {address.landmark && <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <span className="font-bold text-[10px] uppercase text-slate-400">Landmark:</span> {address.landmark}
                                </p>}
                                <p className="text-sm font-medium">{address.city}, {address.state} - <span className="text-blue-600 font-bold">{address.postalCode}</span></p>
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{address.country}</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleEdit(address)}
                                    className="flex-1 flex items-center justify-center bg-blue-50 text-blue-600 py-2.5 px-4 rounded-xl font-bold hover:bg-blue-100 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleSetDefault(address._id!)}
                                    disabled={address.isDefault}
                                    className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-xl font-bold transition-colors ${address.isDefault
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                        }`}
                                >
                                    Set Default
                                </button>
                                <button
                                    onClick={() => handleDelete(address._id!)}
                                    className="flex items-center justify-center bg-red-50 text-red-600 py-2.5 px-4 rounded-xl font-bold hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => setShowAddForm(true)}
                        className="soft-card p-6 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] group"
                    >
                        <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Add New Address</h3>
                        <p className="text-sm text-gray-500">Click to add a delivery address</p>
                    </button>
                </div>

                {addresses.length === 0 && !loading && (
                    <div className="soft-card p-12 text-center mt-10">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <MapPin className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Saved Addresses</h3>
                        <p className="text-gray-600 mb-8">Add your first delivery address to get started!</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <Plus className="w-5 h-5 inline mr-2" />
                            Add Address
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedAddressesPage;
