import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DollarSign, Building2, ClipboardCheck, PackageCheck } from 'lucide-react';

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
                            <DollarSign className="size-4 text-muted-foreground" />
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
                <div className="grid flex-1 gap-4 md:grid-cols-3">
                    <Card className="col-span-2 flex flex-col rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>Purchase Order Value Over Time</CardTitle>
                            <CardDescription>Total purchase order amount per month, {new Date().getFullYear()}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            {chartData.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No purchase orders recorded this year yet.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%" minHeight={260}>
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="poFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="currentColor" stopOpacity={0.4} className="text-primary" />
                                                <stop offset="95%" stopColor="currentColor" stopOpacity={0} className="text-primary" />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                                        <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                                        <YAxis tickLine={false} axisLine={false} className="text-xs" tickFormatter={(v) => peso.format(v)} />
                                        <Tooltip formatter={(value: number) => peso.format(value)} />
                                        <Area
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="currentColor"
                                            className="text-primary"
                                            fill="url(#poFill)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>PO Status Breakdown</CardTitle>
                            <CardDescription>Current purchase orders by status</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-3">
                            {Object.entries(poStatusBreakdown).length === 0 && (
                                <p className="text-sm text-muted-foreground">No purchase orders yet.</p>
                            )}
                            {Object.entries(poStatusBreakdown).map(([status, count]) => (
                                <div key={status} className="flex items-center justify-between">
                                    <Badge variant={statusVariant[status] ?? 'outline'} className="capitalize">
                                        {status}
                                    </Badge>
                                    <span className="text-sm font-medium">{count}</span>
                                </div>
                            ))}
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