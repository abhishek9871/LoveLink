import React, { useState, useEffect } from 'react';
import { mockApi } from '../services/api';
import { AdminUserMetrics, AdminRevenueMetrics, AdminSafetyMetrics, AdminSystemHealth } from '../types';
import { LogoIcon, AdminUsersIcon, AdminRevenueIcon, AdminSafetyIcon, AdminSystemIcon } from '../components/icons';
import Spinner from '../components/ui/Spinner';

type AdminMetrics = {
    users: AdminUserMetrics;
    revenue: AdminRevenueMetrics;
    safety: AdminSafetyMetrics;
    system: AdminSystemHealth;
}

const MetricCard: React.FC<{ title: string; value: string | number; subtext: string; icon: React.ReactNode }> = ({ title, value, subtext, icon }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-start gap-4">
        <div className="bg-primary/10 text-primary p-3 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-text-secondary">{subtext}</p>
        </div>
    </div>
);

const AdminDashboardPage: React.FC = () => {
    const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            try {
                const data = await mockApi.getAdminMetrics();
                setMetrics(data);
            } catch (error) {
                console.error("Failed to load admin metrics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);
    
    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    if (!metrics) {
        return <div className="p-4 text-center">Could not load admin metrics.</div>;
    }

    return (
        <div className="p-4 bg-light-gray min-h-screen">
            <header className="flex items-center gap-2 mb-6">
                <LogoIcon className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </header>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2"><AdminUsersIcon className="w-6 h-6" /> User Metrics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard title="Daily Active" value={metrics.users.dau.toLocaleString()} subtext="Users today" icon={<AdminUsersIcon className="w-6 h-6"/>} />
                    <MetricCard title="Monthly Active" value={metrics.users.mau.toLocaleString()} subtext="Last 30 days" icon={<AdminUsersIcon className="w-6 h-6"/>} />
                    <MetricCard title="New Users" value={metrics.users.newUsers} subtext="Today" icon={<AdminUsersIcon className="w-6 h-6"/>} />
                    <MetricCard title="Retention" value={`${metrics.users.retentionRate}%`} subtext="Monthly" icon={<AdminUsersIcon className="w-6 h-6"/>} />
                </div>

                <h2 className="text-xl font-semibold flex items-center gap-2 pt-4"><AdminRevenueIcon className="w-6 h-6" /> Revenue</h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard title="MRR" value={`$${metrics.revenue.mrr.toLocaleString()}`} subtext="Monthly Recurring" icon={<AdminRevenueIcon className="w-6 h-6"/>} />
                    <MetricCard title="ARPU" value={`$${metrics.revenue.arpu.toFixed(2)}`} subtext="Avg Per User" icon={<AdminRevenueIcon className="w-6 h-6"/>} />
                    <MetricCard title="LTV" value={`$${metrics.revenue.ltv.toFixed(2)}`} subtext="Lifetime Value" icon={<AdminRevenueIcon className="w-6 h-6"/>} />
                    <MetricCard title="Conversion" value={`${metrics.revenue.conversionRate}%`} subtext="Free to Paid" icon={<AdminRevenueIcon className="w-6 h-6"/>} />
                </div>

                <h2 className="text-xl font-semibold flex items-center gap-2 pt-4"><AdminSafetyIcon className="w-6 h-6" /> Safety & Moderation</h2>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <MetricCard title="Open Reports" value={metrics.safety.openReports} subtext="Awaiting review" icon={<AdminSafetyIcon className="w-6 h-6"/>} />
                    <MetricCard title="Response Time" value={`${metrics.safety.avgResponseTimeHours}h`} subtext="Average" icon={<AdminSafetyIcon className="w-6 h-6"/>} />
                    <MetricCard title="Mod Actions" value={metrics.safety.moderationActions} subtext="Last 24h" icon={<AdminSafetyIcon className="w-6 h-6"/>} />
                </div>
                
                <h2 className="text-xl font-semibold flex items-center gap-2 pt-4"><AdminSystemIcon className="w-6 h-6" /> System Health</h2>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <MetricCard title="Uptime" value={`${metrics.system.uptime}%`} subtext="Last 30 days" icon={<AdminSystemIcon className="w-6 h-6"/>} />
                    <MetricCard title="API Latency" value={`${metrics.system.apiLatency}ms`} subtext="Average" icon={<AdminSystemIcon className="w-6 h-6"/>} />
                    <MetricCard title="Error Rate" value={`${metrics.system.errorRate}%`} subtext="Last 24h" icon={<AdminSystemIcon className="w-6 h-6"/>} />
                </div>

            </section>
        </div>
    );
};

export default AdminDashboardPage;
