import React from 'react';
import { Button } from '@/components/ui/button';


interface Props {
}

export default function Index({}: Props) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Supplies Page</h1>
            <Button>
            Add Supplier
            </Button>
        </div>
    );
}