import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Iarforms from '@/components/Iar/iarforms';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';

interface PurchaseOrder {
    id: number;
    po_number: string;
}

interface Delivery {
    id: number;
    invoice_number: string;
    purchase_order_id: number;
}

interface Iar {
    id: number;
    iar_number: string;
    iar_date: string;
    inspected_by: string;
    inspection_date: string;
    status: string;
    remarks: string;
    purchase_order: PurchaseOrder;
    delivery: Delivery | null;
}

interface PaginatedIars {
    data: Iar[];
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
    iars: PaginatedIars;
    purchaseOrders: PurchaseOrder[];
    deliveries: Delivery[];
    filters: Filters;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    passed:  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    failed:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function Index({ iars, purchaseOrders, deliveries, filters }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/iar', { search, status }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get('/iar', { search, status: value }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleClear = () => {
        setSearch('');
        setStatus('');
        router.get('/iar', {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="IAR Reports" />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Inspection & Acceptance Reports</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage IAR entries linked to deliveries
                    </p>
                </div>
                <Button onClick={() => setDialogOpen(true)}>
                    New IAR
                </Button>
            </div>

            <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search IAR number, PO, inspector..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="border border-input bg-background text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="passed">Passed</option>
                    <option value="failed">Failed</option>
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
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">IAR Number</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">PO Number</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Invoice</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Inspected By</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Inspection Date</th>
                            <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {iars.data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-16 text-muted-foreground">
                                    <p className="text-base mb-1">
                                        {filters.search || filters.status ? 'No matching IAR entries' : 'No IAR entries yet'}
                                    </p>
                                    <p className="text-xs">
                                        {filters.search || filters.status ? 'Try different filters' : 'Click "New IAR" to get started'}
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            iars.data.map((iar) => (
                                <tr key={iar.id} className="hover:bg-muted/40 transition-colors">
                                    <td className="px-4 py-3 font-semibold text-foreground">{iar.iar_number}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{iar.purchase_order?.po_number ?? '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{iar.delivery?.invoice_number || '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{iar.inspected_by}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{iar.inspection_date}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[iar.status] ?? 'bg-muted text-muted-foreground'}`}>
                                            {iar.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {iars.data.length > 0 && (
                <div className="flex items-center justify-center gap-1 flex-wrap">
                    {iars.links.map((link, i) => (
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

            <Iarforms
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                purchaseOrders={purchaseOrders}
                deliveries={deliveries}
            />
        </div>
    );
}