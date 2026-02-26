import React from 'react';
import { Users, Activity, Languages, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
    { label: 'Total Users', value: '1,248', icon: Users, trend: '+12%', color: 'from-blue-500/20 to-blue-600/20 text-blue-500' },
    { label: 'Active Sessions', value: '342', icon: Activity, trend: '+5%', color: 'from-green-500/20 to-green-600/20 text-green-500' },
    { label: 'Languages', value: '5', icon: Languages, trend: 'New Added', color: 'from-purple-500/20 to-purple-600/20 text-purple-500' },
    { label: 'Correction Rate', value: '94%', icon: TrendingUp, trend: '+2%', color: 'from-orange-500/20 to-orange-600/20 text-orange-500' },
];

export default function Dashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold font-poppins text-text-primary tracking-tight">Overview</h2>
                <p className="text-text-secondary mt-1">Welcome back. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-surface rounded-2xl border border-surface-light shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 group cursor-default relative overflow-hidden"
                    >
                        <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full blur-2xl group-hover:blur-3xl transition-all opacity-50`} />
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-text-secondary text-sm font-medium mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-text-primary font-nunito">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 relative z-10">
                            <span className="text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-md">
                                {stat.trend}
                            </span>
                            <span className="text-xs text-text-secondary">vs last month</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 bg-surface rounded-2xl border border-surface-light shadow-sm min-h-[400px]">
                    <h3 className="text-lg font-semibold text-text-primary mb-6">Activity Overview</h3>
                    <div className="flex items-center justify-center h-[300px] border border-dashed border-surface-light rounded-xl bg-background/50 text-text-secondary">
                        Chart Placeholder
                    </div>
                </div>
                <div className="p-6 bg-surface rounded-2xl border border-surface-light shadow-sm min-h-[400px]">
                    <h3 className="text-lg font-semibold text-text-primary mb-6">Recent Users</h3>
                    <div className="flex items-center justify-center h-[300px] border border-dashed border-surface-light rounded-xl bg-background/50 text-text-secondary">
                        List Placeholder
                    </div>
                </div>
            </div>
        </div>
    );
}
