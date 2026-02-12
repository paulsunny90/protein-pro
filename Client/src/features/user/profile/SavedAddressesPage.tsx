import { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, Home, Building2, CheckCircle, X, User, Mail, Phone } from 'lucide-react';

interface Address {
    id: string;
    type: 'home' | 'work' | 'other';
    name: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
}

const SavedAddressesPage = () => {
    const [addresses] = useState<Address[]>([
        {
            id: '1',
            type: 'home',
            name: 'John Doe',
            phone: '(123) 456-7890',
            email: 'john@example.com',
            street: '123 Main St, Apt 4B',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
            isDefault: true
        }
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState<Partial<Address>>({
        type: 'home',
        name: '',
        phone: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        isDefault: false
    });

    const getAddressIcon = (type: string) => {
        switch (type) {
            case 'home':
                return <Home className="w-5 h-5" />;
            case 'work':
                return <Building2 className="w-5 h-5" />;
            default:
                return <MapPin className="w-5 h-5" />;
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add logic to save address
        console.log('Saving address:', formData);
        setShowAddForm(false);
        // Reset form
        setFormData({
            type: 'home',
            name: '',
            phone: '',
            email: '',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'United States',
            isDefault: false
        });
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

                {/* Add/Edit Address Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex justify-between items-center rounded-t-3xl">
                                <h2 className="text-2xl font-bold text-gray-900">Add New Address</h2>
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-600" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-8">
                                {/* Address Type */}
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Address Type</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(['home', 'work', 'other'] as const).map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, type }))}
                                                className={`p-4 rounded-xl border-2 font-bold capitalize transition-all ${formData.type === type
                                                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    {getAddressIcon(type)}
                                                    {type}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="John Doe"
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
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="(123) 456-7890"
                                                required
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="john@example.com"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Address Details */}
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            placeholder="123 Main St, Apt 4B"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="New York"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">State / Province</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="NY"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">ZIP / Postal Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            placeholder="10001"
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
                                            <option>United States</option>
                                            <option>Canada</option>
                                            <option>United Kingdom</option>
                                            <option>Australia</option>
                                            <option>Germany</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Default Address Checkbox */}
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

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="flex-1 py-3 px-6 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        Save Address
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Addresses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <div key={address.id} className="soft-card p-6 relative hover:shadow-xl transition-all duration-300 animate-fade-in">
                            {/* Default Badge */}
                            {address.isDefault && (
                                <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Default
                                </div>
                            )}

                            {/* Address Type Icon */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                                    {getAddressIcon(address.type)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 capitalize">{address.type}</h3>
                                    <p className="text-sm text-gray-500">{address.name}</p>
                                </div>
                            </div>

                            {/* Address Details */}
                            <div className="mb-6 text-gray-700">
                                <p className="font-medium">{address.street}</p>
                                <p>{address.city}, {address.state} {address.zipCode}</p>
                                <p>{address.country}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button className="flex-1 flex items-center justify-center bg-blue-50 text-blue-600 py-2.5 px-4 rounded-xl font-bold hover:bg-blue-100 transition-colors">
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit
                                </button>
                                <button className="flex items-center justify-center bg-red-50 text-red-600 py-2.5 px-4 rounded-xl font-bold hover:bg-red-100 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Address Card */}
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="soft-card p-6 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 flex flex-col items-center justify-center min-h-[280px] group"
                    >
                        <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Add New Address</h3>
                        <p className="text-sm text-gray-500">Click to add a delivery address</p>
                    </button>
                </div>

                {/* Empty State */}
                {addresses.length === 0 && (
                    <div className="soft-card p-12 text-center">
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
