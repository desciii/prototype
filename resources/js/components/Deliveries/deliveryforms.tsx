import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PurchaseOrder {
    id: number;
    po_number: string;
    po_amount: number;
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
    received_by_1: '',
    received_by_2: '',
    place_of_delivery: '',
    remarks: '',
    total_amount: '',
};

export default function Deliveryforms({ open, onOpenChange, purchaseOrders }: Props) {
    const [data, setData] = useState(emptyForm);
    const [document, setDocument] = useState<File | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (name === 'purchase_order_id') {
            const po = purchaseOrders.find(p => p.id === Number(value));
            setData({ ...data, purchase_order_id: value, total_amount: po ? String(po.po_amount) : '' });
        } else {
            setData({ ...data, [name]: value });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDocument(e.target.files?.[0] ?? null);
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0) return;
        setImages(prev => [...prev, ...files]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImagePreviews(prev => [...prev, ev.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, String(value));
        });
        if (document) {
            formData.append('document', document);
        }
        images.forEach(img => {
            formData.append('images[]', img);
        });
        router.post('/deliveries', formData, {
            onSuccess: () => {
                onOpenChange(false);
                setData(emptyForm);
                setDocument(null);
                setImages([]);
                setImagePreviews([]);
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
                                <option key={po.id} value={po.id}>{po.po_number}</option>
                            ))}
                        </select>
                        {errors.purchase_order_id && (
                            <p className="text-red-500 text-xs mt-1">{errors.purchase_order_id}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Invoice Number" name="invoice_number" placeholder="e.g. INV-2024-001" value={data.invoice_number} onChange={handleChange} error={errors.invoice_number} />
                        <Field label="Invoice Date" name="invoice_date" type="date" value={data.invoice_date} onChange={handleChange} error={errors.invoice_date} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="DR Number" name="dr_number" placeholder="e.g. DR-2024-001" value={data.dr_number} onChange={handleChange} error={errors.dr_number} />
                        <Field label="DR Date" name="dr_date" type="date" value={data.dr_date} onChange={handleChange} error={errors.dr_date} />
                    </div>

                    <div>
                        <label className={labelClass}>Total Amount</label>
                        <input
                            type="number"
                            name="total_amount"
                            value={data.total_amount}
                            onChange={handleChange}
                            placeholder="Auto-filled from PO"
                            className={inputClass}
                        />
                        {data.purchase_order_id && (
                            <p className="text-xs text-muted-foreground mt-1">Mirrored from selected PO — edit if partial delivery</p>
                        )}
                        {errors.total_amount && <p className="text-red-500 text-xs mt-1">{errors.total_amount}</p>}
                    </div>

                    <Field label="Place of Delivery" name="place_of_delivery" placeholder="e.g. SMU, ASD" value={data.place_of_delivery} onChange={handleChange} error={errors.place_of_delivery} />

                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-sm font-semibold text-foreground">Received By</p>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Recipient 1" name="received_by_1" placeholder="e.g. Juan Dela Cruz" value={data.received_by_1} onChange={handleChange} error={errors.received_by_1} />
                            <Field label="Recipient 2" name="received_by_2" placeholder="e.g. Maria Santos" value={data.received_by_2} onChange={handleChange} error={errors.received_by_2} />
                        </div>
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
                        {errors.remarks && <p className="text-red-500 text-xs mt-1">{errors.remarks}</p>}
                    </div>

                    <div className="border-t border-border pt-4 space-y-4">
                        <p className="text-sm font-semibold text-foreground">Documents & Photos</p>

                        <div>
                            <label className={labelClass}>Scanned Receipt (PDF/JPG/PNG)</label>
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                className={inputClass}
                            />
                            {document && (
                                <p className="text-xs text-muted-foreground mt-1">Selected: {document.name}</p>
                            )}
                            {errors.document && <p className="text-red-500 text-xs mt-1">{errors.document}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Delivery Photos (JPG/PNG, multiple allowed)</label>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                multiple
                                onChange={handleImagesChange}
                                className={inputClass}
                            />
                            {errors['images'] && <p className="text-red-500 text-xs mt-1">{errors['images']}</p>}

                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mt-3">
                                    {imagePreviews.map((src, i) => (
                                        <div key={i} className="relative group rounded-lg overflow-hidden border border-border aspect-square">
                                            <img src={src} alt={'preview-' + i} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {images.length > 0 && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    {images.length} photo{images.length > 1 ? 's' : ''} selected
                                </p>
                            )}
                        </div>
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