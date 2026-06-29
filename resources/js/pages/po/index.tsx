import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/react';
import POForm from '@/components/PurchaseOrders/poforms';

interface Supplier {
    id: number;
    company_name: string;
}

interface Props {
    suppliers: Supplier[];
}

export default function Index({ suppliers }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Purchase Orders</h1>
                <Button onClick={() => setDialogOpen(true)}>
                    Add Purchase Order
                </Button>
            </div>

            {/* your table/list will go here later */}

            <POForm
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                suppliers={suppliers}
            />
        </div>
    );
}