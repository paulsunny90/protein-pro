import { API_URL } from './api';
export const BASE_URL = API_URL.replace('/api', '');

export const formatImageUrl = (url: string | undefined | null): string => {
    if (!url || typeof url !== 'string' || url.trim() === '') {
        return "";
    }

    let processedUrl = url.trim();

    // Already a full URL (http/https or data URI) — use as-is
    if (processedUrl.startsWith('http') || processedUrl.startsWith('data:')) {
        return processedUrl;
    }


    // Fix legacy URLs that might have been saved with localhost during development
    if (processedUrl.includes('localhost:5000') && !BASE_URL.includes('localhost:5000')) {
        processedUrl = processedUrl.replace(/http:\/\/localhost:5000/g, BASE_URL);
        return processedUrl;
    }

    // Normalize backslashes to forward slashes for URL compatibility
    const normalizedPath = processedUrl.replace(/\\/g, '/');

    // Local upload paths — prepend the server BASE_URL to make them accessible
    if (normalizedPath.startsWith('/uploads') || normalizedPath.startsWith('uploads/')) {
        const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
        return `${BASE_URL}${cleanPath}`;
    }

    return normalizedPath || "";
};

