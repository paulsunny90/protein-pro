import api from '../utils/api';

export interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}

export interface ChatResponse {
    success: boolean;
    reply: string;
    error?: string;
}

export const sendChatMessage = async (message: string, context?: any): Promise<string> => {
    try {
        const response = await api.post<ChatResponse>('/chat', { message, context });
        if (response.data.success) {
            return response.data.reply;
        } else {
            throw new Error(response.data.error || 'Failed to get chat response');
        }
    } catch (error: any) {
        console.error('Error sending chat message:', error);
        throw new Error(error.response?.data?.error || 'Failed to connect to chat assistant');
    }
};
