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

interface Supplier {
    id: number;
    company_name: string;
}

interface DeliveryImage {
    id: number;
    image_path: string;
}

interface Delivery {
    id: number;
    invoice_number: string | null;
    invoice_date: string | null;
    dr_number: string | null;
    dr_date: string | null;
    received_by_1: string | null;
    received_by_2: string | null;
    place_of_delivery: string | null;
    remarks: string | null;
    total_amount: number | string | null;
    document_path: string | null;
    images: DeliveryImage[];
    purchase_order: PurchaseOrder;
    supplier: Supplier | null;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    delivery: Delivery | null;
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div>
            <p className="text-xs font-medium text-muted-foreground mb-0.5">{label}</p>
            <p className="text-sm text-foreground">{value || '—'}</p>
        </div>
    );
}

export default function DeliveryView({ open, onOpenChange, delivery }: Props) {
    if (!delivery) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Delivery Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-2">

                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">General</p>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="PO Number" value={delivery.purchase_order?.po_number} />
                            <Field label="Supplier" value={delivery.supplier?.company_name} />
                            <Field label="Invoice Number" value={delivery.invoice_number} />
                            <Field label="Invoice Date" value={delivery.invoice_date} />
                            <Field label="DR Number" value={delivery.dr_number} />
                            <Field label="DR Date" value={delivery.dr_date} />
                            <Field
                                label="Total Amount"
                                value={delivery.total_amount
                                    ? '₱' + Number(delivery.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })
                                    : null}
                            />
                            <Field label="Place of Delivery" value={delivery.place_of_delivery} />
                        </div>
                    </div>

                    <div className="border-t border-border pt-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Received By</p>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Recipient 1" value={delivery.received_by_1} />
                            <Field label="Recipient 2" value={delivery.received_by_2} />
                        </div>
                    </div>

                    {delivery.remarks && (
                        <div className="border-t border-border pt-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Remarks</p>
                            <p className="text-sm text-muted-foreground">{delivery.remarks}</p>
                        </div>
                    )}

                    <div className="border-t border-border pt-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Documents</p>
                        {delivery.document_path ? (
                            <a
                                href={'/storage/' + delivery.document_path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline font-medium"
                            >
                                View Scanned Document
                            </a>
                        ) : (
                            <p className="text-sm text-muted-foreground">No document uploaded</p>
                        )}
                    </div>

                    {delivery.images && delivery.images.length > 0 && (
                        <div className="border-t border-border pt-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                                Delivery Photos ({delivery.images.length})
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {delivery.images.map((img) => (
                                    <a
                                        key={img.id}
                                        href={'/storage/' + img.image_path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block rounded-lg overflow-hidden border border-border aspect-square hover:opacity-80 transition-opacity"
                                    >
                                        <img
                                            src={'/storage/' + img.image_path}
                                            alt="Delivery photo"
                                            className="w-full h-full object-cover"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </DialogContent>
        </Dialog>
    );
}