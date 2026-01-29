import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ChatList } from '@/components/ChatList';
import { ChatInput } from '@/components/ChatInput';
import { Footer } from '@/components/Footer';
import { useChatStore } from '@/stores/chatStore';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Chat() {
    const error = useChatStore(s => s.error);
    const clearError = useChatStore(s => s.clearError);
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        // Mobile-first: default to closed, only open on desktop
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 1024;
        }
        return false;
    });

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    // Handle responsive sidebar - close on mobile, open on desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            }
        };

        // Check on mount
        handleResize();

        // Listen for resize
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-dismiss error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(clearError, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            {/* Main content */}
            <div className="relative z-0 flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                <Header onToggleSidebar={toggleSidebar} />

                {/* Error banner */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 mt-14 z-10"
                        >
                            <p className="text-sm text-destructive text-center">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Chat area - takes remaining space */}
                <div className="flex-1 flex flex-col min-h-0 pt-14">
                    <ChatList />
                </div>

                {/* Footer input - always visible at bottom */}
                <ChatInput />
                <Footer />
            </div>
        </div>
    );
}
