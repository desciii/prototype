import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface FieldProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

function Field({ label, name, type = 'text', placeholder = '', required = false, value, onChange, error }: FieldProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

const emptyForm = {
    company_name: '',
    office_address: '',
    tin: '',
    email: '',
    contact_number: '',
    status: 'active',
    internal_remarks: '',
};

export default function Supplierforms({ open, onOpenChange }: Props) {
    const [data, setData] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/suppliers', data, {
            onSuccess: () => {
                onOpenChange(false);
                setData(emptyForm);
                setErrors({});
            },
            onError: (err) => setErrors(err),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>New Supplier</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">

                    <Field
                        label="Company Name" name="company_name"
                        placeholder="e.g. ABC Trading Co."
                        required value={data.company_name}
                        onChange={handleChange} error={errors.company_name}
                    />

                    <Field
                        label="Office Address" name="office_address"
                        placeholder="e.g. 123 Main St, Davao City"
                        value={data.office_address}
                        onChange={handleChange} error={errors.office_address}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Field
                            label="TIN" name="tin"
                            placeholder="e.g. 123-456-789"
                            value={data.tin}
                            onChange={handleChange} error={errors.tin}
                        />
                        <Field
                            label="Contact Number" name="contact_number"
                            placeholder="e.g. 09171234567"
                            value={data.contact_number}
                            onChange={handleChange} error={errors.contact_number}
                        />
                    </div>

                    <Field
                        label="Email Address" name="email"
                        type="email"
                        placeholder="e.g. supplier@email.com"
                        value={data.email}
                        onChange={handleChange} error={errors.email}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={data.status}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Internal Remarks</label>
                        <textarea
                            name="internal_remarks"
                            value={data.internal_remarks}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Optional internal notes..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save Supplier
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}