import { FiSun, FiMoon, FiPlus, FiMenu } from 'react-icons/fi';
import { UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { DeepSeekLogo } from './DeepSeekLogo';
import { useTheme } from '@/contexts/ThemeContext';
import { useChatStore } from '@/stores/chatStore';

interface HeaderProps {
    onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
    const { theme, toggleTheme } = useTheme();
    const createConversation = useChatStore(s => s.createConversation);

    return (
        <header className="flex items-center justify-between px-2 sm:px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            {/* Left section */}
            <div className="flex items-center gap-1 sm:gap-3">
                {onToggleSidebar && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleSidebar}
                        className="h-9 w-9 lg:hidden"
                    >
                        <FiMenu className="w-4 h-4" />
                    </Button>
                )}
                <div className="flex items-center gap-3">
                    <DeepSeekLogo className="w-9 h-9" />
                    <h1 className="font-semibold text-lg leading-none">DeepSeek</h1>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <TooltipProvider delayDuration={0}>
                    {/* New Chat */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => createConversation()}
                                className="h-9 w-9"
                            >
                                <FiPlus className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>New chat</TooltipContent>
                    </Tooltip>

                    {/* Theme Toggle */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="h-9 w-9"
                            >
                                {theme === 'dark' ? (
                                    <FiSun className="w-4 h-4" />
                                ) : (
                                    <FiMoon className="w-4 h-4" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Toggle theme</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* User Button from Clerk */}
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: 'w-9 h-9',
                        },
                    }}
                />
            </div>
        </header>
    );
}
