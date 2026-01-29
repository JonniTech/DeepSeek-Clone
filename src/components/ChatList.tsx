import { useEffect, useRef, useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { DeepSeekLogo } from './DeepSeekLogo';
import { useMessages, useChatStore } from '@/stores/chatStore';

export function ChatList() {
    const messages = useMessages();
    const isLoading = useChatStore(s => s.isLoading);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Function to scroll to bottom
    const scrollToBottom = useCallback(() => {
        if (scrollContainerRef.current) {
            const viewport = scrollContainerRef.current.querySelector('[data-slot="scroll-area-viewport"]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    }, []);

    // Auto-scroll on new messages or when loading changes
    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, scrollToBottom]);

    // Also scroll when last message content updates (streaming)
    const lastMessage = messages[messages.length - 1];
    useEffect(() => {
        if (lastMessage?.role === 'assistant') {
            scrollToBottom();
        }
    }, [lastMessage?.content, scrollToBottom]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-8 w-full h-full overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center max-w-full px-4"
                >
                    <DeepSeekLogo className="w-16 h-16 sm:w-20 sm:h-20 mb-6" />
                    <h2 className="text-xl sm:text-2xl font-semibold mb-2">DeepSeek Clone</h2>
                    <p className="text-muted-foreground max-w-md text-sm sm:text-base">
                        A developer-focused AI assistant powered by DeepSeek R1. Ask questions about code, algorithms, or any technical topic.
                    </p>
                </motion.div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm w-full max-w-[90vw] sm:max-w-2xl px-2">
                    {[
                        'Explain async/await in JavaScript',
                        'Write a binary search in Python',
                        'How does React reconciliation work?',
                        'Optimize this SQL query',
                    ].map((prompt, i) => (
                        <motion.button
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (i * 0.1), duration: 0.4 }}
                            onClick={() => useChatStore.getState().sendMessage(prompt)}
                            className="px-4 py-3 rounded-xl border border-border hover:bg-muted/50 hover:border-indigo-500/50 text-left transition-all duration-200 shadow-sm"
                        >
                            {prompt}
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div ref={scrollContainerRef} className="flex-1 h-full overflow-hidden w-full chat-scroll-area">
            <ScrollArea className="h-full w-full">
                <div className="w-full max-w-4xl mx-auto pt-4 pb-8 px-2 sm:px-4">
                    <AnimatePresence mode="popLayout">
                        {messages.map((message, index) => {
                            // Hide the last assistant message while it's loading/streaming to show fully formed later
                            if (isLoading && index === messages.length - 1 && message.role === 'assistant') {
                                return null;
                            }
                            return (
                                <ChatMessage
                                    key={message.id}
                                    message={message}
                                    isStreaming={false}
                                />
                            );
                        })}
                    </AnimatePresence>

                    {/* Loading indicator - show when waiting for response (buffering entire output) */}
                    {isLoading && messages[messages.length - 1]?.role === 'assistant' && (
                        <LoadingIndicator />
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

// Progress steps for loading animation
const LOADING_STEPS = [
    'Connecting...',
    'Processing request...',
    'Analyzing your question...',
    'Generating response...',
    'Formatting output...',
];

function LoadingIndicator() {
    const [stepIndex, setStepIndex] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStepIndex((prev: number) => (prev + 1) % LOADING_STEPS.length);
        }, 1500); // Change step every 1.5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 px-4 py-3 sm:py-4"
        >
            <DeepSeekLogo className="w-8 h-8 animate-pulse" />
            <div className="bg-muted/60 border border-border rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={stepIndex}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                                className="text-sm text-muted-foreground"
                            >
                                {LOADING_STEPS[stepIndex]}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden w-32">
                        <motion.div
                            key={stepIndex}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.5, ease: 'linear' }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
