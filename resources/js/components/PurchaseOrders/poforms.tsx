import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Supplier {
    id: number;
    company_name: string;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    suppliers: Supplier[];
}

export default function poforms({ open, onOpenChange, suppliers }: Props) {
    const [data, setData] = useState({
        po_number: '',
        po_date: '',
        po_amount: '',
        unit_office: '',
        supplier_id: '',
        delivery_term: '',
        fund_cluster: '',
        pr_number: '',
        pr_date: '',
        ors_bur_number: '',
        ors_bur_date: '',
        status: 'pending',
        remarks: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/po', data, {
            onSuccess: () => {
                onOpenChange(false);
                setData({
                    po_number: '',
                    po_date: '',
                    po_amount: '',
                    unit_office: '',
                    supplier_id: '',
                    delivery_term: '',
                    fund_cluster: '',
                    pr_number: '',
                    pr_date: '',
                    ors_bur_number: '',
                    ors_bur_date: '',
                    status: 'pending',
                    remarks: '',
                });
            },
            onError: (err) => setErrors(err),
        });
    };

    const Field = ({ label, name, type = 'text', placeholder = '', required = false }: {
        label: string;
        name: string;
        type?: string;
        placeholder?: string;
        required?: boolean;
    }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={data[name as keyof typeof data]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>New Purchase Order</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="P.O Number" name="po_number" placeholder="PO-2024-001" required />
                        <Field label="P.O Date" name="po_date" type="date" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="PO Amount" name="po_amount" type="number" placeholder="0.00" required />
                        <Field label="Unit / Office" name="unit_office" placeholder="Supply Management Unit" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Supplier Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Supplier <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="supplier_id"
                                value={data.supplier_id}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Select Supplier --</option>
                                {suppliers.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.company_name}
                                    </option>
                                ))}
                            </select>
                            {errors.supplier_id && <p className="text-red-500 text-xs mt-1">{errors.supplier_id}</p>}
                        </div>

                        <Field label="Delivery Term" name="delivery_term" placeholder="e.g. 30 days" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Fund Cluster" name="fund_cluster" placeholder="e.g. 01" />
                        <Field label="P.R Number" name="pr_number" placeholder="PR-2024-001" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="P.R Date" name="pr_date" type="date" />
                        <Field label="ORS / BUR No." name="ors_bur_number" placeholder="ORS-2024-001" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="ORS / BUR Date" name="ors_bur_date" type="date" />

                        {/* Status Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                name="status"
                                value={data.status}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="pending">Pending</option>
                                <option value="partial">Partial</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                        <textarea
                            name="remarks"
                            value={data.remarks}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Optional notes..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save Purchase Order
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}