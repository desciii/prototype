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
    pending:   'bg-yellow-100 text-yellow-700',
    partial:   'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function Index({ suppliers, purchaseOrders }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Purchase Orders</h1>
                <Button onClick={() => setDialogOpen(true)}>
                    Add Purchase Order
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">PO Number</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">PO Date</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">Supplier</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">Unit / Office</th>
                            <th className="text-right px-4 py-3 font-semibold text-gray-600">Amount</th>
                            <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {purchaseOrders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-gray-400">
                                    No purchase orders yet. Click "Add Purchase Order" to get started.
                                </td>
                            </tr>
                        ) : (
                            purchaseOrders.map((po) => (
                                <tr key={po.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 font-medium text-gray-800">{po.po_number}</td>
                                    <td className="px-4 py-3 text-gray-600">{po.po_date}</td>
                                    <td className="px-4 py-3 text-gray-600">{po.supplier?.company_name ?? '—'}</td>
                                    <td className="px-4 py-3 text-gray-600">{po.unit_office}</td>
                                    <td className="px-4 py-3 text-right text-gray-800 font-medium">
                                        ₱{Number(po.po_amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[po.status] ?? 'bg-gray-100 text-gray-600'}`}>
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