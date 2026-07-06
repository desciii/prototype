import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PhilippinePeso, Building2, ClipboardCheck, PackageCheck } from 'lucide-react';

interface DashboardProps {
    stats: {
        totalPos: number;
        totalSuppliers: number;
        pendingIars: number;
        totalDeliveries: number;
    };
    poStatusBreakdown: Record<string, number>;
    recentPurchaseOrders: {
        id: number;
        poNumber: string;
        supplier: string;
        amount: number;
        status: 'pending' | 'partial' | 'completed' | 'cancelled';
        date: string;
    }[];
    recentActivity: {
        description: string;
        timestamp: string;
    }[];
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    completed: 'default',
    partial: 'secondary',
    pending: 'outline',
    cancelled: 'destructive',
};

const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

export default function Dashboard({ stats, poStatusBreakdown, recentPurchaseOrders, recentActivity = [] }: DashboardProps) {
    const total = Object.values(poStatusBreakdown).reduce((sum, c) => sum + c, 0);

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <Card className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border text-center">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Total POs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-extrabold text-primary">{stats?.totalPos ?? 0}</div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border text-center">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Suppliers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-extrabold text-primary">{stats?.totalSuppliers ?? 0}</div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border text-center">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Pending IAR
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-extrabold text-primary">{stats?.pendingIars ?? 0}</div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border text-center">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Deliveries
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-extrabold text-primary">{stats?.totalDeliveries ?? 0}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent PO Added + PO Breakdown */}
                <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="flex min-w-0 flex-col rounded-xl border border-sidebar-border/70 dark:border-sidebar-border md:col-span-2">
                        <CardHeader>
                            <CardTitle>Recent PO Added</CardTitle>
                            <CardDescription>Latest purchase orders recorded</CardDescription>
                        </CardHeader>
                        <CardContent className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
                            {recentPurchaseOrders.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No purchase orders yet.</p>
                            ) : (
                                recentPurchaseOrders.map((po) => (
                                    <div
                                        key={po.id}
                                        className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-medium text-foreground truncate">{po.poNumber}</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {po.supplier} &middot; {po.date}
                                            </p>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-3">
                                            <Badge variant={statusVariant[po.status]} className="capitalize">
                                                {po.status}
                                            </Badge>
                                            <span className="text-sm font-semibold tabular-nums">
                                                {peso.format(po.amount)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>PO Breakdown</CardTitle>
                            <CardDescription>Current purchase orders by status</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.entries(poStatusBreakdown).length === 0 ? (
                                <p className="text-sm text-muted-foreground">No purchase orders yet.</p>
                            ) : (
                                Object.entries(poStatusBreakdown).map(([status, count]) => {
                                    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                                    return (
                                        <div key={status} className="space-y-1.5">
                                            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                                                <Badge variant={statusVariant[status] ?? 'outline'} className="shrink-0 capitalize">
                                                    {status}
                                                </Badge>
                                                <span className="shrink-0 text-sm font-medium tabular-nums">
                                                    {count} ({percentage}%)
                                                </span>
                                            </div>
                                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-full rounded-full bg-primary transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest system actions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {recentActivity.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No recent activity.</p>
                        ) : (
                            recentActivity.map((log, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-border/50 py-2 last:border-0">
                                    <p className="text-sm text-foreground">{log.description}</p>
                                    <span className="text-xs text-muted-foreground shrink-0">{log.timestamp}</span>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}