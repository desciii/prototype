import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface PurchaseOrder {
    id: number;
    po_number: string;
    supplier_id: number;
    po_amount: number;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    purchaseOrders: PurchaseOrder[];
}

const inputClass = "w-full border border-input bg-background text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";
const labelClass = "block text-sm font-medium text-foreground mb-1";

function StarRating({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
    return (
        <div>
            <label className={labelClass}>{label} <span className="text-red-500">*</span></label>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className="focus:outline-none"
                    >
                        <Star
                            className={`size-6 transition-colors ${
                                star <= value
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-none text-muted-foreground'
                            }`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

const emptyForm = {
    evaluation_date: '',
    purchase_order_id: '',
    requesting_office: '',
    total_amount: '',
    quality_of_goods: 0,
    timeliness: 0,
    compliance: 0,
};

export default function Evaluationforms({ open, onOpenChange, purchaseOrders }: Props) {
    const [data, setData] = useState(emptyForm);
    const [document, setDocument] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const selectedPo = purchaseOrders.find(po => po.id === Number(data.purchase_order_id));

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name === 'purchase_order_id') {
            const po = purchaseOrders.find(p => p.id === Number(value));
            setData({
                ...data,
                purchase_order_id: value,
                total_amount: po ? String(po.po_amount) : '',
            });
        } else {
            setData({ ...data, [name]: value });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDocument(e.target.files?.[0] ?? null);
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

        router.post('/supplier-evaluations', formData, {
            onSuccess: () => {
                onOpenChange(false);
                setData(emptyForm);
                setDocument(null);
                setErrors({});
            },
            onError: (err) => setErrors(err),
        });
    };

    const supplierName = selectedPo
        ? purchaseOrders.find(po => po.id === selectedPo.id)
        : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>New Supplier Evaluation</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                Evaluation Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="evaluation_date"
                                value={data.evaluation_date}
                                onChange={handleChange}
                                className={inputClass}
                            />
                            {errors.evaluation_date && <p className="text-red-500 text-xs mt-1">{errors.evaluation_date}</p>}
                        </div>

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
                                <option value="">Select PO</option>
                                {purchaseOrders.map((po) => (
                                    <option key={po.id} value={po.id}>{po.po_number}</option>
                                ))}
                            </select>
                            {errors.purchase_order_id && <p className="text-red-500 text-xs mt-1">{errors.purchase_order_id}</p>}
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>
                            Requesting Office <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="requesting_office"
                            value={data.requesting_office}
                            onChange={handleChange}
                            placeholder="e.g. Supply Management Unit"
                            className={inputClass}
                        />
                        {errors.requesting_office && <p className="text-red-500 text-xs mt-1">{errors.requesting_office}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>
                            Total Amount <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="total_amount"
                            value={data.total_amount}
                            onChange={handleChange}
                            placeholder="0.00"
                            className={inputClass}
                        />
                        {errors.total_amount && <p className="text-red-500 text-xs mt-1">{errors.total_amount}</p>}
                    </div>

                    <div className="border-t border-border pt-4 space-y-4">
                        <p className="text-sm font-semibold text-foreground">Performance Ratings (1–5)</p>

                        <StarRating
                            label="Quality of Goods"
                            value={data.quality_of_goods}
                            onChange={(v) => setData({ ...data, quality_of_goods: v })}
                        />
                        {errors.quality_of_goods && <p className="text-red-500 text-xs mt-1">{errors.quality_of_goods}</p>}

                        <StarRating
                            label="Timeliness"
                            value={data.timeliness}
                            onChange={(v) => setData({ ...data, timeliness: v })}
                        />
                        {errors.timeliness && <p className="text-red-500 text-xs mt-1">{errors.timeliness}</p>}

                        <StarRating
                            label="Compliance"
                            value={data.compliance}
                            onChange={(v) => setData({ ...data, compliance: v })}
                        />
                        {errors.compliance && <p className="text-red-500 text-xs mt-1">{errors.compliance}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Scanned SPE Document (PDF/JPG/PNG)</label>
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

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!data.quality_of_goods || !data.timeliness || !data.compliance}
                        >
                            Save Evaluation
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}