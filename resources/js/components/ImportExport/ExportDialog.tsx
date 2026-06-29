import { useState } from 'react';
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

export default function ExportDialog({ open, onOpenChange }: Props) {
    const [module, setModule] = useState('');

    const handleExport = () => {
        if (!module) return;
        window.location.href = `/export?module=${module}`;
        onOpenChange(false);
        setModule('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Export CSV</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">

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
                    </div>

                    <p className="text-xs text-muted-foreground">
                        This will download a CSV file of all records in the selected module.
                    </p>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleExport} disabled={!module}>
                            Download CSV
                        </Button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}