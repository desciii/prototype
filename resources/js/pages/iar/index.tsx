import { Button } from '@/components/ui/button';
import React from 'react';

interface Props {
}

export default function Index({}: Props) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Inspection & Acceptance Report Page</h1>
           <Button>
            Enter IAR Report
            </Button>
        </div>
    );
}