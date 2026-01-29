import { motion } from 'framer-motion';
import { FiArrowLeft, FiTool } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface NotImplementedProps {
    featureName?: string;
}

export function NotImplemented({ featureName = 'This feature' }: NotImplementedProps) {
    return (
        <div className="flex flex-col h-screen bg-background">
            <Header />
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="text-center max-w-md"
                >
                    {/* Icon */}
                    <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-lg"
                    >
                        <FiTool className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                        Coming Soon
                    </h1>

                    {/* Description */}
                    <p className="text-muted-foreground mb-8 text-base sm:text-lg">
                        <span className="font-medium text-foreground">{featureName}</span> is not implemented yet.
                        We're working hard to bring this to you soon!
                    </p>

                    {/* Back button */}
                    <Link to="/">
                        <Button
                            size="lg"
                            className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            Back to Chat
                        </Button>
                    </Link>

                    {/* Decorative elements */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mt-12 flex items-center justify-center gap-2 text-xs text-muted-foreground"
                    >
                        <span className="w-8 h-px bg-border" />
                        <span>Stay tuned for updates</span>
                        <span className="w-8 h-px bg-border" />
                    </motion.div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
}
