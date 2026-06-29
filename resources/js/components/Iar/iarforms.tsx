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

interface Delivery {
    id: number;
    invoice_number: string;
    purchase_order_id: number;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    purchaseOrders: PurchaseOrder[];
    deliveries: Delivery[];
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
    iar_number: '',
    purchase_order_id: '',
    delivery_id: '',
    iar_date: '',
    inspected_by: '',
    inspection_date: '',
    status: 'pending',
    remarks: '',
};

export default function Iarforms({ open, onOpenChange, purchaseOrders, deliveries }: Props) {
    const [data, setData] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Filter deliveries based on selected PO
    const filteredDeliveries = data.purchase_order_id
        ? deliveries.filter(d => String(d.purchase_order_id) === String(data.purchase_order_id))
        : deliveries;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        // Reset delivery when PO changes
        if (name === 'purchase_order_id') {
            setData({ ...data, purchase_order_id: value, delivery_id: '' });
        } else {
            setData({ ...data, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/iar', data, {
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
                    <DialogTitle>New IAR Entry</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">

                    <div className="grid grid-cols-2 gap-4">
                        <Field
                            label="IAR Number" name="iar_number"
                            placeholder="e.g. IAR-2024-001"
                            required value={data.iar_number}
                            onChange={handleChange} error={errors.iar_number}
                        />
                        <Field
                            label="IAR Date" name="iar_date"
                            type="date" required
                            value={data.iar_date}
                            onChange={handleChange} error={errors.iar_date}
                        />
                    </div>

                    {/* PO Number */}
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
                            <option value="">Select PO Number</option>
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

                    {/* Delivery - filtered by selected PO */}
                    <div>
                        <label className={labelClass}>Delivery / Invoice</label>
                        <select
                            name="delivery_id"
                            value={data.delivery_id}
                            onChange={handleChange}
                            className={inputClass}
                            disabled={!data.purchase_order_id}
                        >
                            <option value="">Select Delivery</option>
                            {filteredDeliveries.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.invoice_number || `Delivery #${d.id}`}
                                </option>
                            ))}
                        </select>
                        {!data.purchase_order_id && (
                            <p className="text-muted-foreground text-xs mt-1">Select a PO first</p>
                        )}
                        {errors.delivery_id && (
                            <p className="text-red-500 text-xs mt-1">{errors.delivery_id}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field
                            label="Inspected By" name="inspected_by"
                            placeholder="e.g. Juan Dela Cruz"
                            required value={data.inspected_by}
                            onChange={handleChange} error={errors.inspected_by}
                        />
                        <Field
                            label="Inspection Date" name="inspection_date"
                            type="date" required
                            value={data.inspection_date}
                            onChange={handleChange} error={errors.inspection_date}
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className={labelClass}>Status</label>
                        <select
                            name="status"
                            value={data.status}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="pending">Pending</option>
                            <option value="passed">Passed</option>
                            <option value="failed">Failed</option>
                        </select>
                        {errors.status && (
                            <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                        )}
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className={labelClass}>Remarks</label>
                        <textarea
                            name="remarks"
                            value={data.remarks}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Optional notes..."
                            className={inputClass}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save IAR
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}