import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';
import { DeepSeekLogo } from './DeepSeekLogo';
import { CodeBlock } from './CodeBlock';
import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/stores/chatStore';
import '@/styles/markdown.css';

interface ChatMessageProps {
    message: ChatMessageType;
    isStreaming?: boolean;
}

export const ChatMessage = memo(function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
                'flex gap-3 px-2 py-3 sm:px-4 sm:py-4',
                isUser ? 'justify-end' : 'justify-start'
            )}
        >
            {/* Assistant Avatar - Left side */}
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                    <DeepSeekLogo className={cn("w-8 h-8", isStreaming && "animate-pulse")} />
                </div>
            )}

            {/* Message Bubble */}
            <div
                className={cn(
                    'max-w-[calc(100%-4rem)] sm:max-w-[70%] min-w-0 rounded-2xl px-3 py-2 sm:px-4 sm:py-3',
                    isUser
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md'
                        : 'bg-muted/60 border border-border rounded-bl-md'
                )}
            >
                {/* Message content */}
                <div className={cn(
                    'markdown-body prose max-w-none overflow-x-auto break-words',
                    isUser ? 'prose-invert text-white' : 'prose-invert'
                )}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                const isInline = !match && !className;

                                if (isInline) {
                                    return (
                                        <code
                                            className={cn(
                                                'px-1.5 py-0.5 rounded text-sm font-mono',
                                                isUser
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-zinc-800 text-zinc-200'
                                            )}
                                            {...props}
                                        >
                                            {children}
                                        </code>
                                    );
                                }

                                return (
                                    <CodeBlock language={match?.[1] || 'text'}>
                                        {String(children).replace(/\n$/, '')}
                                    </CodeBlock>
                                );
                            },
                            pre({ children }) {
                                return <>{children}</>;
                            },
                            table({ children, ...props }) {
                                return (
                                    <div className="overflow-x-auto my-4 w-full">
                                        <table {...props}>{children}</table>
                                    </div>
                                );
                            },
                            img({ src, alt, ...props }) {
                                return (
                                    <img
                                        src={src}
                                        alt={alt}
                                        className="max-w-full h-auto rounded-lg my-2"
                                        {...props}
                                    />
                                );
                            },
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>

                {/* Streaming indicator - elegant dot animation below content */}
                {isStreaming && message.content && (
                    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border/50">
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs text-muted-foreground">responding...</span>
                    </div>
                )}
            </div>

            {/* User Avatar - Right side */}
            {isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-white" />
                </div>
            )}
        </motion.div>
    );
});
