import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Supplierforms from '@/components/Suppliers/supplierforms';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import Evaluationforms from '@/components/Suppliers/evaluationforms';

interface Supplier {
    id: number;
    company_name: string;
    office_address: string;
    tin: string;
    email: string;
    contact_number: string;
    status: string;
    internal_remarks: string;
}

interface PaginatedSuppliers {
    data: Supplier[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Filters {
    search: string | null;
    status: string | null;
}

interface Props {
    suppliers: PaginatedSuppliers;
    filters: Filters;
    purchaseOrders: { id: number; po_number: string; supplier_id: number; po_amount: number }[];
}

const statusColors: Record<string, string> = {
    active:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    inactive: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function Index({ suppliers, filters, purchaseOrders }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [evalDialogOpen, setEvalDialogOpen] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/supplies', { search, status }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get('/supplies', { search, status: value }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleClear = () => {
        setSearch('');
        setStatus('');
        router.get('/supplies', {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div className="p-4 space-y-6 sm:p-6">
            <Head title="Suppliers" />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Suppliers</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your supplier directory
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => setEvalDialogOpen(true)} className="flex-1 sm:flex-initial">
                        Evaluate Supplier
                    </Button>
                    <Link href="/supplier-evaluations" className="flex-1 sm:flex-initial">
                        <Button variant="outline" className="w-full">View Ratings</Button>
                    </Link>
                    <Button onClick={() => setDialogOpen(true)} className="flex-1 sm:flex-initial">
                        Add Supplier
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                <div className="relative w-full max-w-sm flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search company, email, TIN, contact..."
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                <Button type="submit" variant="secondary">Search</Button>
                {(filters.search || filters.status) && (
                    <Button type="button" variant="ghost" onClick={handleClear}>
                        Clear
                    </Button>
                )}
            </form>

            {/* Empty state, shared between both layouts */}
            {suppliers.data.length === 0 ? (
                <div className="bg-card border border-border rounded-xl py-16 text-center text-muted-foreground">
                    <p className="text-base mb-1">
                        {filters.search || filters.status ? 'No matching suppliers' : 'No suppliers yet'}
                    </p>
                    <p className="text-xs">
                        {filters.search || filters.status ? 'Try different filters' : 'Click "Add Supplier" to get started'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Mobile: stacked cards */}
                    <div className="space-y-3 md:hidden">
                        {suppliers.data.map((supplier) => (
                            <div
                                key={supplier.id}
                                className="bg-card border border-border rounded-xl p-4 space-y-3"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <p className="font-semibold text-foreground min-w-0 truncate">{supplier.company_name}</p>
                                    <span
                                        className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[supplier.status] ?? 'bg-muted text-muted-foreground'}`}
                                    >
                                        {supplier.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-2 text-sm">
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">Office Address</p>
                                        <p className="text-foreground">{supplier.office_address || '—'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">TIN</p>
                                            <p className="text-foreground truncate">{supplier.tin || '—'}</p>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">Contact</p>
                                            <p className="text-foreground truncate">{supplier.contact_number || '—'}</p>
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <p className="text-foreground truncate">{supplier.email || '—'}</p>
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
                                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Company Name</th>
                                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Office Address</th>
                                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">TIN</th>
                                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Email</th>
                                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Contact</th>
                                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {suppliers.data.map((supplier) => (
                                    <tr key={supplier.id} className="hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">{supplier.company_name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{supplier.office_address || '—'}</td>
                                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{supplier.tin || '—'}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{supplier.email || '—'}</td>
                                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{supplier.contact_number || '—'}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[supplier.status] ?? 'bg-muted text-muted-foreground'}`}>
                                                {supplier.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {suppliers.data.length > 0 && (
                <div className="flex items-center justify-center gap-1 flex-wrap">
                    {suppliers.links.map((link, i) => (
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

            <Supplierforms open={dialogOpen} onOpenChange={setDialogOpen} />
            <Evaluationforms
                open={evalDialogOpen}
                onOpenChange={setEvalDialogOpen}
                purchaseOrders={purchaseOrders}
            />

        </div>
    );
}