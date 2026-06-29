import React from 'react';

interface Props {
    message: string;
}

export default function Index({ message }: Props) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Deliveries Page</h1>
            <p>{message}</p>
        </div>
    );
}