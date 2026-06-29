import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PurchaseOrder {
    id: number;
    po_number: string;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    purchaseOrders: PurchaseOrder[];
}

interface FieldProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

const inputClass = "w-full border border-input bg-background text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";
const labelClass = "block text-sm font-medium text-foreground mb-1";

function Field({ label, name, type = 'text', placeholder = '', required = false, value, onChange, error }: FieldProps) {
    return (
        <div>
            <label className={labelClass}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={inputClass}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

const emptyForm = {
    purchase_order_id: '',
    invoice_number: '',
    invoice_date: '',
    dr_number: '',
    dr_date: '',
};

export default function Deliveryforms({ open, onOpenChange, purchaseOrders }: Props) {
    const [data, setData] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/deliveries', data, {
            onSuccess: () => {
                onOpenChange(false);
                setData(emptyForm);
                setErrors({});
            },
            onError: (err) => setErrors(err),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Record Delivery</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">

                    {/* PO Number Dropdown */}
                    <div>
                        <label className={labelClass}>
                            P.O Number <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="purchase_order_id"
                            value={data.purchase_order_id}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="">-- Select PO Number --</option>
                            {purchaseOrders.map((po) => (
                                <option key={po.id} value={po.id}>
                                    {po.po_number}
                                </option>
                            ))}
                        </select>
                        {errors.purchase_order_id && (
                            <p className="text-red-500 text-xs mt-1">{errors.purchase_order_id}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field
                            label="Invoice Number" name="invoice_number"
                            placeholder="e.g. INV-2024-001"
                            value={data.invoice_number}
                            onChange={handleChange} error={errors.invoice_number}
                        />
                        <Field
                            label="Invoice Date" name="invoice_date"
                            type="date"
                            value={data.invoice_date}
                            onChange={handleChange} error={errors.invoice_date}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field
                            label="DR Number" name="dr_number"
                            placeholder="e.g. DR-2024-001"
                            value={data.dr_number}
                            onChange={handleChange} error={errors.dr_number}
                        />
                        <Field
                            label="DR Date" name="dr_date"
                            type="date"
                            value={data.dr_date}
                            onChange={handleChange} error={errors.dr_date}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save Delivery
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}