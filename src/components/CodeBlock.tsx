import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
    language?: string;
    children: string;
    className?: string;
}

export function CodeBlock({ language = 'text', children, className }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn('relative group rounded-lg overflow-hidden my-4 w-full max-w-full', className)}>
            {/* Header bar */}
            <div className="flex items-center justify-between bg-zinc-800 px-4 py-2 text-xs text-zinc-400">
                <span className="font-mono">{language}</span>
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopy}
                                className="h-6 px-2 text-zinc-400 hover:text-white hover:bg-zinc-700"
                            >
                                {copied ? (
                                    <FiCheck className="w-4 h-4 text-green-400" />
                                ) : (
                                    <FiCopy className="w-4 h-4" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>{copied ? 'Copied!' : 'Copy code'}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Code content */}
            <SyntaxHighlighter
                language={language}
                style={oneDark}
                customStyle={{
                    margin: 0,
                    padding: '1rem',
                    background: '#1a1a1a',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    overflowX: 'auto', // Ensure code scrolls horizontally
                }}
                showLineNumbers={children.split('\n').length > 5}
                wrapLines
            >
                {children}
            </SyntaxHighlighter>
        </div>
    );
}
