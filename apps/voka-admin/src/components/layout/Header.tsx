import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="h-20 bg-surface/50 backdrop-blur-md border-b border-surface-light flex items-center justify-between px-8 sticky top-0 z-10"
        >
            <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                    type="text"
                    placeholder="Search languages, users..."
                    className="w-full bg-background border border-surface-light rounded-full py-2 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative text-text-secondary hover:text-text-primary transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-surface"></span>
                </button>
                <div className="flex items-center gap-3 pl-6 border-l border-surface-light cursor-pointer">
                    <div className="text-right">
                        <p className="text-sm font-medium text-text-primary">Admin User</p>
                        <p className="text-xs text-text-secondary">admin@voka.app</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md">
                        <User className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
