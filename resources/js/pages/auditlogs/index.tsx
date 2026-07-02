import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface AuditLog {
    id: number;
    action: string;
    model: string;
    model_id: number | null;
    old_values: Record<string, any> | null;
    new_values: Record<string, any> | null;
    ip_address: string | null;
    created_at: string;
    user: { id: number; name: string } | null;
}

interface PaginatedLogs {
    data: AuditLog[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Filters {
    search: string | null;
    action: string | null;
}

interface Props {
    logs: PaginatedLogs;
    filters: Filters;
}

const actionColors: Record<string, string> = {
    created: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    updated: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    deleted: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const modelRoutes: Record<string, string> = {
    Supplier:           '/supplies',
    PurchaseOrder:      '/po',
    Delivery:           '/deliveries',
    Iar:                '/iar',
    SupplierEvaluation: '/supplier-evaluations',
};

function modelLabel(model: string) {
    return model.split('\\').pop() ?? model;
}

function modelLink(model: string): string | null {
    const label = modelLabel(model);
    return modelRoutes[label] ?? null;
}

export default function Index({ logs, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [action, setAction] = useState(filters.action ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/audit-logs', { search, action }, {
            preserveState: true, preserveScroll: true, replace: true,
        });
    };

    const handleActionChange = (value: string) => {
        setAction(value);
        router.get('/audit-logs', { search, action: value }, {
            preserveState: true, preserveScroll: true, replace: true,
        });
    };

    const handleClear = () => {
        setSearch('');
        setAction('');
        router.get('/audit-logs', {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Audit Logs" />

            <div>
                <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    System activity log — all create, update, and delete actions.
                </p>
            </div>

            <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search model or user..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <select
                    value={action}
                    onChange={e => handleActionChange(e.target.value)}
                    className="border border-input bg-background text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                    <option value="">All Actions</option>
                    <option value="created">Created</option>
                    <option value="updated">Updated</option>
                    <option value="deleted">Deleted</option>
                </select>

                <Button type="submit" variant="secondary">Search</Button>
                {(filters.search || filters.action) && (
                    <Button type="button" variant="ghost" onClick={handleClear}>Clear</Button>
                )}
            </form>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Timestamp</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">User</th>
                            <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Action</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Changed</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Record ID</th>
                            <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Page</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {logs.data.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-16 text-muted-foreground">
                                    <p className="text-base mb-1">No audit logs yet</p>
                                    <p className="text-xs">Actions on records will appear here automatically</p>
                                </td>
                            </tr>
                        ) : (
                            logs.data.map((log) => {
                                const href = modelLink(log.model);
                                return (
                                    <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                                            {new Date(log.created_at).toLocaleString('en-PH')}
                                        </td>
                                        <td className="px-4 py-3 text-foreground font-medium">
                                            {log.user?.name ?? 'System'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${actionColors[log.action] ?? 'bg-muted text-muted-foreground'}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{modelLabel(log.model)}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{log.model_id ?? '—'}</td>
                                        <td className="px-4 py-3 text-center">
                                            {href ? (
                                                <Link
                                                    href={href}
                                                    className="text-xs text-primary hover:underline font-medium"
                                                >
                                                    View Page
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {logs.data.length > 0 && (
                <div className="flex items-center justify-center gap-1 flex-wrap">
                    {logs.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            preserveScroll
                            preserveState
                            className={`px-3 py-1.5 rounded-md text-sm border transition-colors
                                ${link.active
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-card text-foreground border-border hover:bg-muted/50'}
                                ${!link.url ? 'opacity-40 pointer-events-none' : ''}
                            `}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}