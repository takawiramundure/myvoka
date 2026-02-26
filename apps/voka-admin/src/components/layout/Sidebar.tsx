import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Languages, Users, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/languages', label: 'Languages', icon: Languages },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-64 bg-surface border-r border-surface-light flex flex-col h-full shrink-0"
        >
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8 text-text-primary">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-green-600 flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
                        V
                    </div>
                    <h1 className="text-2xl font-bold font-nunito tracking-tight">Voká<span className="text-primary">Admin</span></h1>
                </div>

                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => twMerge(
                                clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-text-secondary hover:bg-surface-light hover:text-text-primary"
                                )
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={clsx("w-5 h-5 transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
                                    {item.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-surface-light">
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-text-secondary hover:bg-error/10 hover:text-error transition-all duration-200 group text-sm font-medium">
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Log Out
                </button>
            </div>
        </motion.aside>
    );
}
