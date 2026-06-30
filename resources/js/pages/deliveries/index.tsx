import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Deliveryforms from '@/components/Deliveries/deliveryforms';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';

interface PurchaseOrder {
    id: number;
    po_number: string;
}

interface Supplier {
    id: number;
    company_name: string;
}

interface Delivery {
    id: number;
    invoice_number: string;
    invoice_date: string;
    dr_number: string;
    dr_date: string;
    purchase_order: PurchaseOrder;
    supplier: Supplier | null;
}

interface PaginatedDeliveries {
    data: Delivery[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Filters {
    search: string | null;
}

interface Filters {
    search: string | null;
    po_id: string | null;
}

interface Props {
    deliveries: PaginatedDeliveries;
    purchaseOrders: PurchaseOrder[];
    filters: Filters;
}

export default function Index({ deliveries, purchaseOrders, filters }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const [poId, setPoId] = useState(filters.po_id ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/deliveries', { search, po_id: poId }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handlePoChange = (value: string) => {
        setPoId(value);
        router.get('/deliveries', { search, po_id: value }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleClear = () => {
        setSearch('');
        setPoId('');
        router.get('/deliveries', {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Deliveries" />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Deliveries</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Track and record all deliveries
                    </p>
                </div>
                <Button onClick={() => setDialogOpen(true)}>
                    Record Delivery
                </Button>
            </div>

            <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search PO, invoice, DR number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <select
                    value={poId}
                    onChange={(e) => handlePoChange(e.target.value)}
                    className="border border-input bg-background text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                    <option value="">All Purchase Orders</option>
                    {purchaseOrders.map((po) => (
                        <option key={po.id} value={po.id}>{po.po_number}</option>
                    ))}
                </select>

                <Button type="submit" variant="secondary">Search</Button>
                {(filters.search || filters.po_id) && (
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
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Supplier</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Invoice No.</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Invoice Date</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">DR Number</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">DR Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {deliveries.data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-16 text-muted-foreground">
                                    <p className="text-base mb-1">
                                        {filters.search || filters.po_id ? 'No matching deliveries' : 'No deliveries recorded yet'}
                                    </p>
                                    <p className="text-xs">
                                        {filters.search || filters.po_id ? 'Try different filters' : 'Click "Record Delivery" to get started'}
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            deliveries.data.map((delivery) => (
                                <tr key={delivery.id} className="hover:bg-muted/40 transition-colors">
                                    <td className="px-4 py-3 font-semibold text-foreground">
                                        {delivery.purchase_order?.po_number ?? '—'}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {delivery.supplier?.company_name ?? '—'}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{delivery.invoice_number || '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{delivery.invoice_date || '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{delivery.dr_number || '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{delivery.dr_date || '—'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {deliveries.data.length > 0 && (
                <div className="flex items-center justify-center gap-1 flex-wrap">
                    {deliveries.links.map((link, i) => (
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

            <Deliveryforms
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                purchaseOrders={purchaseOrders}
            />
        </div>
    );
}