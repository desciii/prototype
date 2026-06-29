import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Deliveryforms from '@/components/Deliveries/deliveryforms';
import { Head } from '@inertiajs/react';

interface PurchaseOrder {
    id: number;
    po_number: string;
}

interface Delivery {
    id: number;
    invoice_number: string;
    invoice_date: string;
    dr_number: string;
    dr_date: string;
    purchase_order: PurchaseOrder;
}

interface Props {
    deliveries: Delivery[];
    purchaseOrders: PurchaseOrder[];
}

export default function Index({ deliveries, purchaseOrders }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="p-6 space-y-6">
            <Head title="Deliveries" />
            {/* Header */}
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

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Deliveries',    value: deliveries.length },
                    { label: 'With Invoice',        value: deliveries.filter(d => d.invoice_number).length },
                    { label: 'With Delivery Receipt',             value: deliveries.filter(d => d.dr_number).length },
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
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Invoice No.</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Invoice Date</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">DR Number</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">DR Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {deliveries.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-16 text-muted-foreground">
                                    <p className="text-base mb-1">No deliveries recorded yet</p>
                                    <p className="text-xs">Click "Record Delivery" to get started</p>
                                </td>
                            </tr>
                        ) : (
                            deliveries.map((delivery) => (
                                <tr key={delivery.id} className="hover:bg-muted/40 transition-colors">
                                    <td className="px-4 py-3 font-semibold text-foreground">
                                        {delivery.purchase_order?.po_number ?? '—'}
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

            <Deliveryforms
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                purchaseOrders={purchaseOrders}
            />
        </div>
    );
}