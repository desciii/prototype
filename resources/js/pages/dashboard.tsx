import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PhilippinePeso, Building2, ClipboardCheck, PackageCheck } from 'lucide-react';

interface DashboardProps {
    stats: {
        totalPoAmount: number;
        activeSuppliers: number;
        pendingIars: number;
        completedPos: number;
    };
    poStatusBreakdown: Record<string, number>;
    chartData: { month: string; amount: number }[];
    recentPurchaseOrders: {
        id: number;
        poNumber: string;
        supplier: string;
        amount: number;
        status: 'pending' | 'partial' | 'completed' | 'cancelled';
        date: string;
    }[];
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    completed: 'default',
    partial: 'secondary',
    pending: 'outline',
    cancelled: 'destructive',
};

const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

export default function Dashboard({ stats, poStatusBreakdown, chartData, recentPurchaseOrders }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Stat cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total PO Value</CardTitle>
                            <PhilippinePeso className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{peso.format(stats.totalPoAmount)}</div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Suppliers</CardTitle>
                            <Building2 className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeSuppliers}</div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending IARs</CardTitle>
                            <ClipboardCheck className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pendingIars}</div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Completed POs</CardTitle>
                            <PackageCheck className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completedPos}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart + status breakdown */}
                <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="flex min-w-0 flex-col rounded-xl border border-sidebar-border/70 dark:border-sidebar-border md:col-span-2">
                        <CardHeader>
                            <CardTitle>Purchase Order Value Over Time</CardTitle>
                            <CardDescription>Total purchase order amount per month, {new Date().getFullYear()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px] w-full sm:h-[320px]">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <AreaChart
                                        data={chartData}
                                        margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                                    >
                                        <defs>
                                            <linearGradient id="poFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid
                                            vertical={false}
                                            strokeDasharray="3 3"
                                            stroke="rgba(128,128,128,0.2)"
                                        />

                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 12, fill: 'currentColor' }}
                                            tickLine={false}
                                            axisLine={false}
                                        />

                                        <YAxis
                                            width={70}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fontSize: 11, fill: 'currentColor' }}
                                            tickFormatter={(v) =>
                                                v >= 1000000
                                                    ? `₱${(v / 1000000).toFixed(1)}M`
                                                    : v >= 1000
                                                    ? `₱${(v / 1000).toFixed(0)}K`
                                                    : `₱${v}`
                                            }
                                        />

                                        <Tooltip
                                            formatter={(value: number) => [peso.format(value), 'PO Amount']}
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                                color: 'hsl(var(--foreground))',
                                                fontSize: '13px',
                                            }}
                                            labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                                            cursor={{ stroke: 'rgba(128,128,128,0.2)' }}
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#6366f1"
                                            fill="url(#poFill)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>PO Status Breakdown</CardTitle>
                            <CardDescription>Current purchase orders by status</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.entries(poStatusBreakdown).length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No purchase orders yet.
                                </p>
                            ) : (
                                (() => {
                                    const total = Object.values(poStatusBreakdown).reduce(
                                        (sum, count) => sum + count,
                                        0
                                    );

                                    return Object.entries(poStatusBreakdown).map(([status, count]) => {
                                        const percentage =
                                            total > 0 ? Math.round((count / total) * 100) : 0;

                                        return (
                                            <div key={status} className="space-y-1.5">
                                                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                                                    <Badge
                                                        variant={statusVariant[status] ?? "outline"}
                                                        className="shrink-0 capitalize"
                                                    >
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
                                    });
                                })()
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent purchase orders */}
                <Card className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <CardHeader>
                        <CardTitle>Recent Purchase Orders</CardTitle>
                        <CardDescription>Latest POs by date</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>PO Number</TableHead>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentPurchaseOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            No purchase orders yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recentPurchaseOrders.map((po) => (
                                        <TableRow key={po.id}>
                                            <TableCell className="font-medium">{po.poNumber}</TableCell>
                                            <TableCell>{po.supplier}</TableCell>
                                            <TableCell>{po.date}</TableCell>
                                            <TableCell>
                                                <Badge variant={statusVariant[po.status]} className="capitalize">
                                                    {po.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">{peso.format(po.amount)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};