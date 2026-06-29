import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Supplierforms from '@/components/Suppliers/supplierforms';

export default function Index() {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Suppliers</h1>
                <Button onClick={() => setDialogOpen(true)}>
                    Add Supplier
                </Button>
            </div>

            {/* table goes here later */}

            <Supplierforms
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </div>
    );
}