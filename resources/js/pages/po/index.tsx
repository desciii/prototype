import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import POForm from '@/components/PurchaseOrders/poforms';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';

interface Supplier {
    id: number;
    company_name: string;
}

interface PurchaseOrder {
    id: number;
    po_number: string;
    po_date: string;
    po_amount: number;
    unit_office: string;
    status: string;
    supplier: Supplier;
}

interface PaginatedPOs {
    data: PurchaseOrder[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Filters {
    search: string | null;
}

interface Filters {
    search: string | null;
    status: string | null;
}

interface Props {
    suppliers: Supplier[];
    purchaseOrders: PaginatedPOs;
    filters: Filters;
}

const statusColors: Record<string, string> = {
    pending:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    partial:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function Index({ suppliers, purchaseOrders, filters }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/po', { search, status }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get('/po', { search, status: value }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleClear = () => {
        setSearch('');
        setStatus('');
        router.get('/po', {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Purchase Orders" />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Purchase Orders</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage and track all purchase orders
                    </p>
                </div>
                <Button onClick={() => setDialogOpen(true)}>
                    Add Purchase Order
                </Button>
            </div>

            <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search PO number, office, supplier..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Status filter dropdown */}
                <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="border border-input bg-background text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                <Button type="submit" variant="secondary">Search</Button>
                {(filters.search || filters.status) && (
                    <Button type="button" variant="ghost" onClick={handleClear}>
                        Clear
                    </Button>
                )}
            </form>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">PO Number</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">PO Date</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Supplier</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Unit / Office</th>
                            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Amount</th>
                            <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {purchaseOrders.data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-16 text-muted-foreground">
                                    <p className="text-base mb-1">
                                        {filters.search ? `No results for "${filters.search}"` : 'No purchase orders yet'}
                                    </p>
                                    <p className="text-xs">
                                        {filters.search ? 'Try a different search term' : 'Click "Add Purchase Order" to get started'}
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            purchaseOrders.data.map((po) => (
                                <tr key={po.id} className="hover:bg-muted/40 transition-colors">
                                    <td className="px-4 py-3 font-semibold text-foreground">{po.po_number}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{po.po_date}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{po.supplier?.company_name ?? '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{po.unit_office}</td>
                                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                                        ₱{Number(po.po_amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[po.status] ?? 'bg-muted text-muted-foreground'}`}>
                                            {po.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {purchaseOrders.data.length > 0 && (
                <div className="flex items-center justify-center gap-1 flex-wrap">
                    {purchaseOrders.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            preserveScroll
                            preserveState
                            className={`px-3 py-1.5 rounded-md text-sm border transition-colors
                                ${link.active
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-card text-foreground border-border hover:bg-muted/50'}
                                ${!link.url ? 'opacity-40 pointer-events-none' : ''}
                            `}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}

            <POForm
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                suppliers={suppliers}
            />
        </div>
    );
}