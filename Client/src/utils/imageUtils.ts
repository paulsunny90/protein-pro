const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const BASE_URL = API_URL.replace('/api', '');

export const formatImageUrl = (url: string | undefined): string => {
    if (!url) return "https://via.placeholder.com/300";
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    if (url.startsWith('/uploads')) return `${BASE_URL}${url}`;
    return url;
};
