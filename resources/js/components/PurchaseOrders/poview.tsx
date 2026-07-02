import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

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
    document_path: string | null;
    delivery_term: string | null;
    fund_cluster: string | null;
    pr_number: string | null;
    pr_date: string | null;
    ors_bur_number: string | null;
    ors_bur_date: string | null;
    remarks: string | null;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    purchaseOrder: PurchaseOrder | null;
}

const statusColors: Record<string, string> = {
    pending:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    partial:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const peso = (amount: number) =>
    '₱' + Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 2 });

function Field({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground break-words">{value || '—'}</p>
        </div>
    );
}

export default function POView({ open, onOpenChange, purchaseOrder }: Props) {
    if (!purchaseOrder) return null;

    const docUrl = purchaseOrder.document_path
        ? '/storage/' + purchaseOrder.document_path
        : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Purchase Order Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-5 pt-2">

                    {/* Header row */}
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-lg font-bold text-foreground">
                            {purchaseOrder.po_number}
                        </span>
                        <span
                            className={
                                'shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ' +
                                (statusColors[purchaseOrder.status] ?? 'bg-muted text-muted-foreground')
                            }
                        >
                            {purchaseOrder.status}
                        </span>
                    </div>

                    {/* PO Info */}
                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Purchase Order Info
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <Field label="PO Date" value={purchaseOrder.po_date} />
                            <Field label="Amount" value={peso(purchaseOrder.po_amount)} />
                            <Field label="Unit / Office" value={purchaseOrder.unit_office} />
                            <Field label="Delivery Term" value={purchaseOrder.delivery_term} />
                            <Field label="Fund Cluster" value={purchaseOrder.fund_cluster} />
                        </div>
                    </div>

                    {/* Supplier */}
                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Supplier
                        </p>
                        <Field label="Company Name" value={purchaseOrder.supplier?.company_name} />
                    </div>

                    {/* PR Info */}
                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Purchase Request
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <Field label="PR Number" value={purchaseOrder.pr_number} />
                            <Field label="PR Date" value={purchaseOrder.pr_date} />
                        </div>
                    </div>

                    {/* ORS / BUR Info */}
                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            ORS / BUR
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <Field label="ORS/BUR Number" value={purchaseOrder.ors_bur_number} />
                            <Field label="ORS/BUR Date" value={purchaseOrder.ors_bur_date} />
                        </div>
                    </div>

                    {/* Remarks */}
                    {purchaseOrder.remarks && (
                        <div className="border-t border-border pt-4 space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Remarks
                            </p>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{purchaseOrder.remarks}</p>
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