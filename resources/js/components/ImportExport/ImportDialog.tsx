import { useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const inputClass = "w-full border border-input bg-background text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
const labelClass = "block text-sm font-medium text-foreground mb-1";

const modules = [
    { value: 'suppliers',       label: 'Suppliers' },
    { value: 'purchase_orders', label: 'Purchase Orders' },
    { value: 'deliveries',      label: 'Deliveries' },
    { value: 'iars',            label: 'IAR Reports' },
];

export default function ImportDialog({ open, onOpenChange }: Props) {
    const [module, setModule] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('module', module);
        formData.append('file', file);

        router.post('/import', formData, {
            onSuccess: () => {
                onOpenChange(false);
                setModule('');
                setFile(null);
                if (fileRef.current) fileRef.current.value = '';
                setErrors({});
            },
            onError: (err) => setErrors(err),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Import CSV</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">

                    <div>
                        <label className={labelClass}>
                            Target Module <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={module}
                            onChange={(e) => setModule(e.target.value)}
                            className={inputClass}
                        >
                            <option value="">Select Module</option>
                            {modules.map((m) => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                        {errors.module && <p className="text-red-500 text-xs mt-1">{errors.module}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>
                            CSV File <span className="text-red-500">*</span>
                        </label>
                        <input
                            ref={fileRef}
                            type="file"
                            accept=".csv"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            className={inputClass}
                        />
                        {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        CSV must include headers matching the database columns.
                    </p>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!module || !file}>
                            Import
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}