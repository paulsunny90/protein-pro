import { API_URL } from './api';
export const BASE_URL = API_URL.replace('/api', '');

export const formatImageUrl = (url: string | undefined): string => {
    if (!url) return "https://via.placeholder.com/300";

    let processedUrl = url;

    // Fix legacy URLs that might have been saved with localhost during development
    if (processedUrl.includes('localhost:5000') && !BASE_URL.includes('localhost:5000')) {
        processedUrl = processedUrl.replace(/http:\/\/localhost:5000/g, BASE_URL);
    }

    if (processedUrl.startsWith('http') || processedUrl.startsWith('data:')) return processedUrl;

    // Normalize backslashes to forward slashes for URL compatibility
    const normalizedPath = url.replace(/\\/g, '/');

    // Ensure relative paths starting with 'uploads' or '/uploads' use the BASE_URL
    if (normalizedPath.startsWith('/uploads')) {
        return `${BASE_URL}${normalizedPath}`;
    }
    if (normalizedPath.startsWith('uploads')) {
        return `${BASE_URL}/${normalizedPath}`;
    }

    return normalizedPath;
};
      