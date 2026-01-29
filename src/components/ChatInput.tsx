import { useState, useCallback, type KeyboardEvent, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';

export function ChatInput() {
    const [input, setInput] = useState('');
    const isLoading = useChatStore(s => s.isLoading);
    const sendMessage = useChatStore(s => s.sendMessage);

    const handleSend = useCallback(() => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        sendMessage(trimmed);
        setInput('');
    }, [input, isLoading, sendMessage]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-border bg-background p-2 sm:p-4"
        >
            <div className="max-w-3xl mx-auto">
                <div className="relative flex items-end gap-2">
                    <Textarea
                        value={input}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Send a message..."
                        disabled={isLoading}
                        rows={1}
                        className={cn(
                            'min-h-[52px] max-h-[200px] resize-none pr-12',
                            'bg-muted/50 border-border focus:border-blue-500/50',
                            'placeholder:text-muted-foreground/50'
                        )}
                        style={{
                            height: 'auto',
                            overflowY: input.split('\n').length > 5 ? 'auto' : 'hidden',
                        }}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        size="icon"
                        className={cn(
                            'absolute right-2 bottom-2 h-8 w-8',
                            'bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
                        )}
                    >
                        <FiSend className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
