import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, Home, CheckCircle, X, User, Phone, Loader2, Mail, Globe, Map } from 'lucide-react';
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
            label: address.label,
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
            isDefault: address.isDefault,
            landmark: address.landmark
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
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#a3e635]/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none"></div>

            <div className="container-max relative z-10 px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 animate-slide-up">
                    <div>
                        <div className="inline-flex items-center space-x-3 text-[#a3e635] mb-4">
                            <MapPin className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-[0.3em]">Personal Information</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                            SAVED <span className="text-[#a3e635]">ADDRESSES</span>
                        </h1>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center justify-center bg-[#a3e635] text-black py-4 px-8 rounded-2xl font-black text-lg shadow-xl shadow-[#a3e635]/20 hover:bg-[#b4f04a] transition-all active:scale-95 group"
                    >
                        <Plus className="w-6 h-6 mr-2 transition-transform group-hover:rotate-90" />
                        Add New Address
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 flex justify-between items-center animate-fade-in">
                        <div className="flex items-center gap-3">
                            <X className="w-5 h-5" />
                            <span className="font-medium">{error}</span>
                        </div>
                        <button onClick={() => dispatch(clearAddressError())} className="hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading && !showAddForm && (
                    <div className="flex justify-center items-center py-32">
                        <Loader2 className="w-12 h-12 text-[#a3e635] animate-spin" />
                    </div>
                )}

                {/* Addresses Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {addresses.map((address, index) => (
                            <div
                                key={address._id}
                                className="soft-card p-8 group relative flex flex-col h-full animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {address.isDefault && (
                                    <div className="absolute top-6 right-6 bg-[#a3e635]/10 text-[#a3e635] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-[#a3e635]/20">
                                        <CheckCircle className="w-3 h-3" />
                                        Default
                                    </div>
                                )}

                                <div className="mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 text-[#a3e635] group-hover:bg-[#a3e635] group-hover:text-black transition-all duration-300">
                                        {address.label?.toLowerCase() === 'home' ? <Home className="w-6 h-6" /> :
                                            address.label?.toLowerCase() === 'office' ? <Globe className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
                                        {address.label || 'Address'}
                                    </h3>
                                    <p className="text-[#a3e635] font-black text-sm tracking-wide uppercase">
                                        {address.firstName} {address.lastName}
                                    </p>
                                </div>

                                <div className="space-y-3 mb-8 flex-grow">
                                    <div className="flex items-start gap-4 text-slate-400">
                                        <Map className="w-5 h-5 mt-1 text-slate-500 shrink-0" />
                                        <div className="text-sm font-medium leading-relaxed">
                                            <p className="text-white font-bold">{address.houseNoOrName && `${address.houseNoOrName}, `}{address.street}</p>
                                            {address.landmark && <p className="text-xs text-slate-500 italic mt-1 pb-1">Near {address.landmark}</p>}
                                            <p>{address.city}, {address.state} - <span className="text-[#a3e635] font-black">{address.postalCode}</span></p>
                                            <p className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-50">{address.country}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/5 space-y-2">
                                        <div className="flex items-center text-sm text-slate-400 font-medium">
                                            <Mail className="w-4 h-4 mr-3 text-slate-500" />
                                            {address.email}
                                        </div>
                                        <div className="flex items-center text-sm text-slate-400 font-medium">
                                            <Phone className="w-4 h-4 mr-3 text-slate-500" />
                                            {address.phone}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleEdit(address)}
                                        className="flex-1 flex items-center justify-center bg-white/5 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors border border-white/10"
                                    >
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Edit
                                    </button>
                                    {!address.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(address._id!)}
                                            className="flex-1 flex items-center justify-center bg-[#a3e635]/5 text-[#a3e635] py-3.5 rounded-xl font-bold text-sm hover:bg-[#a3e635]/10 transition-colors border border-[#a3e635]/10"
                                        >
                                            Set Default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(address._id!)}
                                        className="flex items-center justify-center bg-red-500/10 text-red-500 py-3.5 px-4 rounded-xl font-bold hover:bg-red-500/20 transition-colors border border-red-500/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add Card Placeholder */}
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="soft-card p-8 border-2 border-dashed border-white/10 hover:border-[#a3e635]/30 hover:bg-[#a3e635]/5 transition-all duration-500 flex flex-col items-center justify-center min-h-[350px] group animate-slide-up"
                            style={{ animationDelay: `${addresses.length * 100}ms` }}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#a3e635] transition-all duration-300">
                                <Plus className="w-8 h-8 text-slate-500 group-hover:text-black" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-2">Add New</h3>
                            <p className="text-slate-500 font-medium text-sm">Delivery Address</p>
                        </button>
                    </div>
                )}

                {addresses.length === 0 && !loading && (
                    <div className="soft-card p-20 text-center animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#a3e635]/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                        <div className="relative z-10">
                            <div className="mx-auto w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8 rotate-12 group-hover:rotate-0 transition-transform">
                                <MapPin className="w-12 h-12 text-[#a3e635]" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-4 tracking-tight">NO SAVED ADDRESSES</h3>
                            <p className="text-slate-400 font-medium mb-10 max-w-md mx-auto">
                                You haven't added any shipping addresses yet.
                                Add one now for a faster checkout experience!
                            </p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="bg-[#a3e635] text-black py-4 px-10 rounded-2xl font-black text-xl shadow-xl shadow-[#a3e635]/20 hover:bg-[#b4f04a] transition-all active:scale-95"
                            >
                                <Plus className="w-6 h-6 inline mr-2" />
                                Add Your First Address
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal - Full Dark Mode */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-[#111] border border-white/10 rounded-[2.5rem] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-[#111]/80 backdrop-blur-md border-b border-white/5 px-10 py-8 flex justify-between items-center rounded-t-[2.5rem] z-20">
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-tight">{editingId ? 'EDIT' : 'ADD'} <span className="text-[#a3e635]">ADDRESS</span></h2>
                                <p className="text-slate-500 text-sm font-medium mt-1">Fill in the details for your delivery location</p>
                            </div>
                            <button
                                onClick={handleCloseForm}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all hover:rotate-90 text-slate-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-10">
                            <div className="mb-10">
                                <label className="block text-xs font-black text-[#a3e635] uppercase tracking-widest mb-4">Address Label</label>
                                <div className="flex flex-wrap gap-3">
                                    {['Home', 'Office', 'Other'].map((l) => (
                                        <button
                                            key={l}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, label: l }))}
                                            className={`px-8 py-3.5 rounded-xl font-black text-sm transition-all ${formData.label === l
                                                    ? 'bg-[#a3e635] text-black shadow-lg shadow-[#a3e635]/20'
                                                    : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                    {formData.label !== 'Home' && formData.label !== 'Office' && formData.label !== 'Other' && (
                                        <input
                                            type="text"
                                            value={formData.label || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                                            className="flex-1 min-w-[200px] px-6 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-[#a3e635]/50 outline-none transition-all"
                                            placeholder="Specify label..."
                                        />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, label: '' }))}
                                        className={`px-6 py-3.5 rounded-xl bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 transition-all font-black text-sm ${(formData.label !== 'Home' && formData.label !== 'Office' && formData.label !== 'Other') ? 'hidden' : ''}`}
                                    >
                                        Custom
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <label className="block text-xs font-black text-[#a3e635] uppercase tracking-widest mb-3">First Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-[#a3e635] transition-colors" />
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName || ''}
                                            onChange={handleInputChange}
                                            placeholder="John"
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:bg-white/[0.08] focus:border-[#a3e635]/50 transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-[#a3e635] uppercase tracking-widest mb-3">Last Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-[#a3e635] transition-colors" />
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName || ''}
                                            onChange={handleInputChange}
                                            placeholder="Doe"
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:bg-white/[0.08] focus:border-[#a3e635]/50 transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <label className="block text-xs font-black text-[#a3e635] uppercase tracking-widest mb-3">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-[#a3e635] transition-colors" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email || ''}
                                            onChange={handleInputChange}
                                            placeholder="john@example.com"
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:bg-white/[0.08] focus:border-[#a3e635]/50 transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#a3e635] uppercase tracking-widest mb-3">Phone Number</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-[#a3e635] transition-colors" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone || ''}
                                            onChange={handleInputChange}
                                            placeholder="123 456 7890"
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:bg-white/[0.08] focus:border-[#a3e635]/50 transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-xs font-black text-[#a3e635] uppercase tracking-widest mb-3">House / Apartment No.</label>
                                <div className="relative group">
                                    <Home className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-[#a3e635] transition-colors" />
                                    <input
                                        type="text"
                                        name="houseNoOrName"
                                        value={formData.houseNoOrName || ''}
                                        onChange={handleInputChange}
                                        placeholder="Suite 500 / Apt 4B"
                                        className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:bg-white/[0.08] focus:border-[#a3e635]/50 transition-all outline-none font-medium"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <label className="block text-xs font-black text-[#a3e635] uppercase tracking-widest mb-3">Street Address</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-[#a3e635] transition-colors" />
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street || ''}
                                            onChange={handleInputChange}
                                            placeholder="123 Broadway St"
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:bg-white/[0.08] focus:border-[#a3e635]/50 transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#a3e635] uppercase tracking-widest mb-3">Landmark (Optional)</label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={formData.landmark || ''}
                                        onChange={handleInputChange}
                                        placeholder="Opposite Central Park"
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:bg-white/[0.08] focus:border-[#a3e635]/50 transition-all outline-none font-medium"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <label className="block text-xs font-black text-[#a3e635] uppercase tracking-widest mb-3">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city || ''}
                                        onChange={handleInputChange}
                                        placeholder="New York"
                                        required
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:bg-white/[0.08] focus:border-[#a3e635]/50 transition-all outline-none font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-[#a3e635] uppercase tracking-widest mb-3">State / Province</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state || ''}
                                        onChange={handleInputChange}
                                        placeholder="NY"
                                        required
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:bg-white/[0.08] focus:border-[#a3e635]/50 transition-all outline-none font-medium"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <label className="block text-xs font-black text-[#a3e635] uppercase tracking-widest mb-3">Postal / ZIP Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode || ''}
                                        onChange={handleInputChange}
                                        placeholder="10001"
                                        required
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:bg-white/[0.08] focus:border-[#a3e635]/50 transition-all outline-none font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-[#a3e635] uppercase tracking-widest mb-3">Country</label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:bg-white/[0.08] focus:border-[#a3e635]/50 transition-all outline-none appearance-none cursor-pointer font-medium"
                                    >
                                        <option className="bg-[#111]">India</option>
                                        <option className="bg-[#111]">United States</option>
                                        <option className="bg-[#111]">Canada</option>
                                        <option className="bg-[#111]">United Kingdom</option>
                                        <option className="bg-[#111]">Australia</option>
                                        <option className="bg-[#111]">Germany</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-10">
                                <label className="flex items-center cursor-pointer group w-fit">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="isDefault"
                                            checked={formData.isDefault}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div className={`w-12 h-6 rounded-full transition-all duration-300 ${formData.isDefault ? 'bg-[#a3e635]' : 'bg-white/10'}`}></div>
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${formData.isDefault ? 'translate-x-6' : ''}`}></div>
                                    </div>
                                    <span className="ml-4 text-sm font-black text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">
                                        Set as default address
                                    </span>
                                </label>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="flex-1 py-5 px-8 bg-white/5 text-white rounded-2xl font-black text-lg hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[2] py-5 px-8 bg-[#a3e635] text-black rounded-2xl font-black text-lg shadow-xl shadow-[#a3e635]/20 hover:bg-[#b4f04a] transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {submitting ? 'PROCESSING...' : 'SAVE ADDRESS'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedAddressesPage;
