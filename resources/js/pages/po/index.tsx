import { useState } from 'react';
import { Button } from '@/components/ui/button';
import POForm from '@/components/PurchaseOrders/poforms';

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

interface Props {
    suppliers: Supplier[];
    purchaseOrders: PurchaseOrder[];
}

const statusColors: Record<string, string> = {
    pending:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    partial:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function Index({ suppliers, purchaseOrders }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="p-6 space-y-6">

            {/* Header */}
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

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total POs', value: purchaseOrders.length },
                    { label: 'Pending',   value: purchaseOrders.filter(p => p.status === 'pending').length },
                    { label: 'Completed', value: purchaseOrders.filter(p => p.status === 'completed').length },
                    { label: 'Cancelled', value: purchaseOrders.filter(p => p.status === 'cancelled').length },
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
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">PO Number</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">PO Date</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Supplier</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Unit / Office</th>
                            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Amount</th>
                            <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {purchaseOrders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-16 text-muted-foreground">
                                    <p className="text-base mb-1">No purchase orders yet</p>
                                    <p className="text-xs">Click "Add Purchase Order" to get started</p>
                                </td>
                            </tr>
                        ) : (
                            purchaseOrders.map((po) => (
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

            <POForm
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                suppliers={suppliers}
            />
        </div>
    );
}