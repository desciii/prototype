import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface PurchaseOrder {
    id: number;
    po_number: string;
}

interface Delivery {
    id: number;
    invoice_number: string;
    purchase_order_id: number;
}

interface Iar {
    id: number;
    iar_number: string;
    iar_date: string;
    inspected_by: string;
    inspection_date: string;
    status: string;
    remarks: string | null;
    document_path: string | null;
    purchase_order: PurchaseOrder;
    delivery: Delivery | null;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    iar: Iar | null;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    passed:  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    failed:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

function Field({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground break-words">{value || '—'}</p>
        </div>
    );
}

export default function IarView({ open, onOpenChange, iar }: Props) {
    if (!iar) return null;

    const docUrl = iar.document_path
        ? '/storage/' + iar.document_path
        : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>IAR Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-5 pt-2">

                    {/* Header row */}
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-lg font-bold text-foreground">
                            {iar.iar_number}
                        </span>
                        <span
                            className={
                                'shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ' +
                                (statusColors[iar.status] ?? 'bg-muted text-muted-foreground')
                            }
                        >
                            {iar.status}
                        </span>
                    </div>

                    {/* Linked Records */}
                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Linked Records
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <Field label="PO Number" value={iar.purchase_order?.po_number} />
                            <Field label="Invoice Number" value={iar.delivery?.invoice_number} />
                        </div>
                    </div>

                    {/* Inspection Info */}
                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Inspection Info
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <Field label="IAR Date" value={iar.iar_date} />
                            <Field label="Inspection Date" value={iar.inspection_date} />
                            <Field label="Inspected By" value={iar.inspected_by} />
                        </div>
                    </div>

                    {/* Remarks */}
                    {iar.remarks && (
                        <div className="border-t border-border pt-4 space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Remarks
                            </p>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{iar.remarks}</p>
                        </div>
                    )}

                    {/* Document */}
                    <div className="border-t border-border pt-4 space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Scanned Document
                        </p>
                        {docUrl ? (
                            <a
                                href={docUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-sm font-medium"
                            >
                                View Document
                            </a>
                        ) : (
                            <p className="text-sm text-muted-foreground">No document attached</p>
                        )}
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}