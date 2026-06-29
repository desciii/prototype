import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Iarforms from '@/components/Iar/iarforms';

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

interface Props {
    iars: Iar[];
    purchaseOrders: PurchaseOrder[];
    deliveries: Delivery[];
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    passed:  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    failed:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function Index({ iars, purchaseOrders, deliveries }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="p-6 space-y-6">

            {/* Header */}
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

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total IARs',  value: iars.length },
                    { label: 'Pending',     value: iars.filter(i => i.status === 'pending').length },
                    { label: 'Passed',      value: iars.filter(i => i.status === 'passed').length },
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
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">IAR Number</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">PO Number</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Invoice</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Inspected By</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Inspection Date</th>
                            <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {iars.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-16 text-muted-foreground">
                                    <p className="text-base mb-1">No IAR entries yet</p>
                                    <p className="text-xs">Click "New IAR" to get started</p>
                                </td>
                            </tr>
                        ) : (
                            iars.map((iar) => (
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

            <Iarforms
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                purchaseOrders={purchaseOrders}
                deliveries={deliveries}
            />
        </div>
    );
}