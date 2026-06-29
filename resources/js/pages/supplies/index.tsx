import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Supplierforms from '@/components/Suppliers/supplierforms';

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

interface Props {
    suppliers: Supplier[];
}

const statusColors: Record<string, string> = {
    active:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    inactive: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function Index({ suppliers }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Suppliers</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your supplier directory
                    </p>
                </div>
                <Button onClick={() => setDialogOpen(true)}>
                    Add Supplier
                </Button>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Suppliers', value: suppliers.length },
                    { label: 'Active',          value: suppliers.filter(s => s.status === 'active').length },
                    { label: 'Inactive',        value: suppliers.filter(s => s.status === 'inactive').length },
                ].map(stat => (
                    <div key={stat.label} className="bg-card border border-border rounded-xl px-4 py-3">
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Company Name</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Office Address</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">TIN</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Email</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Contact</th>
                            <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {suppliers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-16 text-muted-foreground">
                                    <p className="text-base mb-1">No suppliers yet</p>
                                    <p className="text-xs">Click "Add Supplier" to get started</p>
                                </td>
                            </tr>
                        ) : (
                            suppliers.map((supplier) => (
                                <tr key={supplier.id} className="hover:bg-muted/40 transition-colors">
                                    <td className="px-4 py-3 font-semibold text-foreground">{supplier.company_name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{supplier.office_address || '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{supplier.tin || '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{supplier.email || '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{supplier.contact_number || '—'}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[supplier.status] ?? 'bg-muted text-muted-foreground'}`}>
                                            {supplier.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Supplierforms
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </div>
    );
}