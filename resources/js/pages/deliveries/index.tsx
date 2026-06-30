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
    document_path: string | null;
    purchase_order: PurchaseOrder;
    supplier: Supplier | null;
}

interface PaginatedDeliveries {
    data: Delivery[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Filters {
    search: string | null;
    supplier_id: string | null;
}

interface Props {
    deliveries: PaginatedDeliveries;
    suppliers: Supplier[];
    purchaseOrders: PurchaseOrder[]; 
    filters: Filters;
}

export default function Index({
    deliveries,
    suppliers,
    purchaseOrders,
    filters,
}: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const [supplierId, setSupplierId] = useState(filters.supplier_id ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/deliveries', {
            search,
            supplier_id: supplierId,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSupplierChange = (value: string) => {
        setSupplierId(value);

        router.get('/deliveries', {
            search,
            supplier_id: value,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleClear = () => {
        setSearch('');
        setSupplierId('');
        router.get('/deliveries', {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div className="p-4 space-y-6 sm:p-6">
            <Head title="Deliveries" />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Deliveries</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Track and record all deliveries
                    </p>
                </div>
                <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto">
                    Record Delivery
                </Button>
            </div>

            <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                <div className="relative w-full max-w-sm flex-1 sm:flex-initial">
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
                    value={supplierId}
                    onChange={(e) => handleSupplierChange(e.target.value)}
                    className="border border-input bg-background text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                    <option value="">All Suppliers</option>

                    {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                            {supplier.company_name}
                        </option>
                    ))}
                </select>

                <Button type="submit" variant="secondary">Search</Button>
                {(filters.search || filters.supplier_id) && (
                    <Button type="button" variant="ghost" onClick={handleClear}>
                        Clear
                    </Button>
                )}
            </form>

            {/* Empty state, shared between both layouts */}
            {deliveries.data.length === 0 ? (
                <div className="bg-card border border-border rounded-xl py-16 text-center text-muted-foreground">
                    <p className="text-base mb-1">
                        {filters.search || filters.supplier_id ? 'No matching deliveries' : 'No deliveries recorded yet'}
                    </p>
                    <p className="text-xs">
                        {filters.search || filters.supplier_id ? 'Try different filters' : 'Click "Record Delivery" to get started'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Mobile: stacked cards */}
                    <div className="space-y-3 md:hidden">
                        {deliveries.data.map((delivery) => (
                            <div
                                key={delivery.id}
                                className="bg-card border border-border rounded-xl p-4 space-y-3"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-foreground truncate">
                                            {delivery.purchase_order?.po_number ?? '—'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                            {delivery.supplier?.company_name ?? '—'}
                                        </p>
                                    </div>
                                    {delivery.document_path !== null ? (
                                        <a
                                            href={`/storage/${delivery.document_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="shrink-0 text-primary hover:underline text-xs font-medium"
                                        >
                                            View Doc
                                        </a>
                                    ) : (
                                        <span className="shrink-0 text-muted-foreground text-xs">No Doc</span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">Invoice No.</p>
                                        <p className="text-foreground truncate">{delivery.invoice_number || '—'}</p>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">Invoice Date</p>
                                        <p className="text-foreground truncate">{delivery.invoice_date || '—'}</p>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">DR Number</p>
                                        <p className="text-foreground truncate">{delivery.dr_number || '—'}</p>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">DR Date</p>
                                        <p className="text-foreground truncate">{delivery.dr_date || '—'}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop / tablet: table */}
                    <div className="hidden md:block bg-card border border-border rounded-xl overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">PO Number</th>
                                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Supplier</th>
                                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Invoice No.</th>
                                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Invoice Date</th>
                                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">DR Number</th>
                                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">DR Date</th>
                                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Scanned Document</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {deliveries.data.map((delivery) => (
                                    <tr key={delivery.id} className="hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                                            {delivery.purchase_order?.po_number ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {delivery.supplier?.company_name ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{delivery.invoice_number || '—'}</td>
                                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{delivery.invoice_date || '—'}</td>
                                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{delivery.dr_number || '—'}</td>
                                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{delivery.dr_date || '—'}</td>
                                        <td className="px-4 py-3 text-center">
                                            {delivery.document_path !== null ? (
                                                <a
                                                    href={`/storage/${delivery.document_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline text-xs font-medium"
                                                >
                                                    View
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

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