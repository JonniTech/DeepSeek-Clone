import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import {
    FiMessageSquare,
    FiTrash2,
    FiChevronLeft,
    FiChevronRight,
    FiPlus,
    FiVideo,
    FiMic,
    FiImage,
    FiSettings,
    FiZap,
    FiLogOut
} from 'react-icons/fi';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useChatStore, type Conversation } from '@/stores/chatStore';
import { cn } from '@/lib/utils';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut } = useClerk();
    const conversations = useChatStore(s => s.conversations);
    const activeId = useChatStore(s => s.activeConversationId);
    const setActiveConversation = useChatStore(s => s.setActiveConversation);
    const deleteConversation = useChatStore(s => s.deleteConversation);
    const createConversation = useChatStore(s => s.createConversation);

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const handleNewChat = () => {
        createConversation();
        if (location.pathname !== '/') {
            navigate('/');
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onToggle}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Toggle button when closed - desktop only */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="fixed left-0 top-1/2 -translate-y-1/2 z-20 hidden lg:block"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggle}
                            className="h-12 w-6 rounded-l-none rounded-r-lg bg-muted/80 hover:bg-muted border-r-0 border border-border shadow-md"
                        >
                            <FiChevronRight className="w-4 h-4" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar panel */}
            <motion.aside
                initial={false}
                animate={{
                    width: isOpen ? 260 : 0,
                    x: isOpen ? 0 : -260,
                }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className={cn(
                    'fixed lg:relative inset-y-0 left-0 z-40 h-full border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col overflow-hidden',
                    !isOpen && 'lg:border-r-0 pointer-events-none'
                )}
            >
                {/* Inner wrapper with fixed width to prevent content collapse */}
                <div className="w-[260px] h-full flex flex-col">
                    {/* Header / New Chat */}
                    <div className="p-3 border-b border-border/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 px-2">
                                <span className="font-semibold text-lg tracking-tight">DeepSeek</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 text-muted-foreground">
                                <FiChevronLeft className="w-4 h-4" />
                            </Button>
                        </div>

                        <Button
                            onClick={handleNewChat}
                            className="w-full justify-start gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                        >
                            <FiPlus className="w-4 h-4" />
                            <span className="font-medium">New Chat</span>
                        </Button>
                    </div>

                    {/* Modes */}
                    <div className="px-3 py-2 space-y-1 border-b border-border/50">
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">Modes</div>
                        <ModeButton icon={FiMessageSquare} label="Chat" to="/" active={location.pathname === '/'} />
                        <ModeButton icon={FiImage} label="Generate Image" to="/generate-image" active={location.pathname === '/generate-image'} />
                        <ModeButton icon={FiVideo} label="Generate Video" to="/generate-video" active={location.pathname === '/generate-video'} />
                        <ModeButton icon={FiMic} label="Audio" to="/audio" active={location.pathname === '/audio'} />
                    </div>

                    {/* Conversations list */}
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        <div className="px-5 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider shrink-0">Recent Chats</div>
                        <ScrollArea className="flex-1 h-full">
                            <div className="px-3 pb-2 space-y-0.5">
                                {conversations.length === 0 ? (
                                    <div className="text-sm text-muted-foreground text-center py-8 px-4">
                                        <p>No recent chats</p>
                                    </div>
                                ) : (
                                    conversations.map((conv: Conversation) => (
                                        <ConversationItem
                                            key={conv.id}
                                            conversation={conv}
                                            isActive={conv.id === activeId}
                                            onSelect={() => {
                                                setActiveConversation(conv.id);
                                                if (location.pathname !== '/') {
                                                    navigate('/');
                                                }
                                            }}
                                            onDelete={() => deleteConversation(conv.id)}
                                            formatDate={formatDate}
                                        />
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Footer actions */}
                    <div className="p-3 border-t border-border/50 bg-muted/20 space-y-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 hover:bg-indigo-500/10 hover:text-indigo-500"
                            onClick={() => navigate('/upgrade')}
                        >
                            <FiZap className="w-4 h-4" />
                            <span>Upgrade to Pro</span>
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                            onClick={() => navigate('/settings')}
                        >
                            <FiSettings className="w-4 h-4" />
                            <span>Settings</span>
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => signOut({ redirectUrl: '/sign-in' })}
                        >
                            <FiLogOut className="w-4 h-4" />
                            <span>Log out</span>
                        </Button>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}

function ModeButton({ icon: Icon, label, to, active }: { icon: any, label: string, to: string, active?: boolean }) {
    const navigate = useNavigate();

    return (
        <Button
            variant="ghost"
            onClick={() => navigate(to)}
            className={cn(
                "w-full justify-start gap-3 h-9",
                active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
        >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{label}</span>
        </Button>
    )
}

interface ConversationItemProps {
    conversation: Conversation;
    isActive: boolean;
    onSelect: () => void;
    onDelete: () => void;
    formatDate: (timestamp: number) => string;
}

function ConversationItem({ conversation, isActive, onSelect, onDelete, formatDate }: ConversationItemProps) {
    return (
        <div
            className={cn(
                'group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-all duration-200',
                isActive
                    ? 'bg-muted text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            )}
            onClick={onSelect}
        >
            <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{conversation.title}</p>
                <p className="text-[10px] opacity-60 truncate">{formatDate(conversation.updatedAt)}</p>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive -mr-1"
            >
                <FiTrash2 className="w-3.5 h-3.5" />
            </Button>
        </div>
    );
}
