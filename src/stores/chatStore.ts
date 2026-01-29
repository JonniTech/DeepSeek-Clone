import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Message, streamChat } from '@/lib/openrouter';

export interface ChatMessage extends Message {
    id: string;
    reasoning?: string;
    timestamp: number;
}

export interface Conversation {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: number;
    updatedAt: number;
}

interface ChatState {
    conversations: Conversation[];
    activeConversationId: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    createConversation: () => string;
    deleteConversation: (id: string) => void;
    setActiveConversation: (id: string | null) => void;
    sendMessage: (content: string) => Promise<void>;
    clearError: () => void;
}

const generateId = () => crypto.randomUUID();

const generateTitle = (content: string): string => {
    const words = content.trim().split(/\s+/).slice(0, 5).join(' ');
    return words.length > 30 ? words.slice(0, 30) + '...' : words || 'New Chat';
};

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            conversations: [],
            activeConversationId: null,
            isLoading: false,
            error: null,

            createConversation: () => {
                const id = generateId();
                const conversation: Conversation = {
                    id,
                    title: 'New Chat',
                    messages: [],
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                };

                set(state => ({
                    conversations: [conversation, ...state.conversations],
                    activeConversationId: id,
                }));

                return id;
            },

            deleteConversation: (id: string) => {
                set(state => {
                    const newConversations = state.conversations.filter(c => c.id !== id);
                    const newActiveId = state.activeConversationId === id
                        ? (newConversations[0]?.id ?? null)
                        : state.activeConversationId;

                    return {
                        conversations: newConversations,
                        activeConversationId: newActiveId,
                    };
                });
            },

            setActiveConversation: (id: string | null) => {
                set({ activeConversationId: id });
            },

            sendMessage: async (content: string) => {
                const state = get();
                let conversationId = state.activeConversationId;

                // Create new conversation if none active
                if (!conversationId) {
                    conversationId = get().createConversation();
                }

                const userMessage: ChatMessage = {
                    id: generateId(),
                    role: 'user',
                    content,
                    timestamp: Date.now(),
                };

                // Add user message and update title if first message
                set(state => ({
                    isLoading: true,
                    error: null,
                    conversations: state.conversations.map(conv => {
                        if (conv.id !== conversationId) return conv;

                        const isFirstMessage = conv.messages.length === 0;
                        return {
                            ...conv,
                            title: isFirstMessage ? generateTitle(content) : conv.title,
                            messages: [...conv.messages, userMessage],
                            updatedAt: Date.now(),
                        };
                    }),
                }));

                // Get messages for API call
                const conversation = get().conversations.find(c => c.id === conversationId);
                if (!conversation) return;

                const apiMessages: Message[] = conversation.messages.map(m => ({
                    role: m.role,
                    content: m.content,
                }));

                const assistantId = generateId();

                // Add placeholder assistant message
                set(state => ({
                    conversations: state.conversations.map(conv => {
                        if (conv.id !== conversationId) return conv;
                        return {
                            ...conv,
                            messages: [...conv.messages, {
                                id: assistantId,
                                role: 'assistant' as const,
                                content: '',
                                reasoning: '',
                                timestamp: Date.now(),
                            }],
                        };
                    }),
                }));

                try {
                    for await (const chunk of streamChat(apiMessages)) {
                        set(state => ({
                            conversations: state.conversations.map(conv => {
                                if (conv.id !== conversationId) return conv;
                                return {
                                    ...conv,
                                    messages: conv.messages.map(msg => {
                                        if (msg.id !== assistantId) return msg;
                                        return {
                                            ...msg,
                                            content: chunk.content,
                                            reasoning: chunk.reasoning,
                                        };
                                    }),
                                    updatedAt: Date.now(),
                                };
                            }),
                        }));
                    }
                } catch (err) {
                    set({ error: err instanceof Error ? err.message : 'An error occurred' });

                    // Remove empty assistant message on error
                    set(state => ({
                        conversations: state.conversations.map(conv => {
                            if (conv.id !== conversationId) return conv;
                            return {
                                ...conv,
                                messages: conv.messages.filter(m => m.id !== assistantId || m.content),
                            };
                        }),
                    }));
                } finally {
                    set({ isLoading: false });
                }
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'deepseek-chat-storage',
            partialize: (state) => ({
                conversations: state.conversations,
                activeConversationId: state.activeConversationId,
            }),
        }
    )
);

// Derived selectors
export const useActiveConversation = () => {
    const conversations = useChatStore(s => s.conversations);
    const activeId = useChatStore(s => s.activeConversationId);
    return conversations.find(c => c.id === activeId) ?? null;
};

export const useMessages = () => {
    const conversation = useActiveConversation();
    return conversation?.messages ?? [];
};
