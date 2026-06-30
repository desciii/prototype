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
};

export default function Poforms({ open, onOpenChange, suppliers }: Props) {
    const [data, setData] = useState(emptyForm);
    const [document, setDocument] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDocument(e.target.files?.[0] ?? null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });
        if (document) {
            formData.append('document', document);
        }

        router.post('/po', formData, {
            onSuccess: () => {
                onOpenChange(false);
                setData(emptyForm);
                setDocument(null);
                setErrors({});
            },
            onError: (err) => setErrors(err),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>New Purchase Order</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="P.O Number" name="po_number" placeholder="PO-2024-001" required value={data.po_number} onChange={handleChange} error={errors.po_number} />
                        <Field label="P.O Date" name="po_date" type="date" required value={data.po_date} onChange={handleChange} error={errors.po_date} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="PO Amount" name="po_amount" type="number" placeholder="0.00" required value={data.po_amount} onChange={handleChange} error={errors.po_amount} />
                        <Field label="Unit / Office" name="unit_office" placeholder="Supply Management Unit" required value={data.unit_office} onChange={handleChange} error={errors.unit_office} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                Supplier <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="supplier_id"
                                value={data.supplier_id}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="">Select Supplier</option>
                                {suppliers.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.company_name}
                                    </option>
                                ))}
                            </select>
                            {errors.supplier_id && <p className="text-red-500 text-xs mt-1">{errors.supplier_id}</p>}
                        </div>

                        <Field label="Delivery Term" name="delivery_term" placeholder="e.g. 30 days" value={data.delivery_term} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Fund Cluster" name="fund_cluster" placeholder="e.g. 01" value={data.fund_cluster} onChange={handleChange} />
                        <Field
                            label="P.R Number"
                            name="pr_number"
                            placeholder="PR-2024-001"
                            value={data.pr_number}
                            onChange={handleChange}
                            error={errors.pr_number}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="P.R Date" name="pr_date" type="date" value={data.pr_date} onChange={handleChange} />
                        <Field
                            label="ORS / BUR No."
                            name="ors_bur_number"
                            placeholder="ORS-2024-001"
                            value={data.ors_bur_number}
                            onChange={handleChange}
                            error={errors.ors_bur_number}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="ORS / BUR Date" name="ors_bur_date" type="date" value={data.ors_bur_date} onChange={handleChange} />

                        <div>
                            <label className={labelClass}>Status</label>
                            <select
                                name="status"
                                value={data.status}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="pending">Pending</option>
                                <option value="partial">Partial</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Document Upload */}
                    <div>
                        <label className={labelClass}>Scanned Document (JPG, PNG, or PDF)</label>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleFileChange}
                            className={inputClass}
                        />
                        {document && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Selected: {document.name}
                            </p>
                        )}
                        {errors.document && <p className="text-red-500 text-xs mt-1">{errors.document}</p>}
                    </div>

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
                            Save Purchase Order
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}