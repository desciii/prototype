import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Star, ArrowLeft } from 'lucide-react';

interface Supplier {
    id: number;
    company_name: string;
}

interface PurchaseOrder {
    id: number;
    po_number: string;
}

interface SupplierEvaluation {
    id: number;
    evaluation_date: string;
    requesting_office: string;
    total_amount: number | string;
    quality_of_goods: number;
    timeliness: number;
    compliance: number;
    document_path: string | null;
    supplier: Supplier | null;
    purchase_order: PurchaseOrder | null;
}

interface PaginatedEvaluations {
    data: SupplierEvaluation[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Filters {
    search: string | null;
}

interface Props {
    evaluations: PaginatedEvaluations;
    filters: Filters;
}

function average(evaluation: SupplierEvaluation) {
    return (evaluation.quality_of_goods + evaluation.timeliness + evaluation.compliance) / 3;
}

function ratingColor(score: number) {
    if (score >= 4) return 'text-green-600 dark:text-green-400';
    if (score >= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
}

function Stars({ score }: { score: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    className={`size-3.5 ${
                        i <= Math.round(score)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-none text-muted-foreground/30'
                    }`}
                />
            ))}
        </div>
    );
}

export default function Evaluations({ evaluations, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/supplier-evaluations', { search }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleClear = () => {
        setSearch('');
        router.get('/supplier-evaluations', {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Supplier Ratings" />

            <div className="flex items-center justify-between">
                <div>
                    <Link
                        href="/supplies"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
                    >
                        <ArrowLeft className="size-3.5" /> Back to Suppliers
                    </Link>
                    <h1 className="text-2xl font-bold text-foreground">Supplier Performance Evaluation Masterlist</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Supplier Performance Evaluations
                    </p>
                </div>
            </div>

            <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search supplier, PO number, or office..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Button type="submit" variant="secondary">Search</Button>
                {filters.search && (
                    <Button type="button" variant="ghost" onClick={handleClear}>
                        Clear
                    </Button>
                )}
            </form>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Date</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Supplier</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">PO Number</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Requesting Office</th>
                            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Amount</th>
                            <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Quality</th>
                            <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Timeliness</th>
                            <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Compliance</th>
                            <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Overall</th>
                            <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Scanned Document</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {evaluations.data.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-16 text-muted-foreground">
                                    <p className="text-base mb-1">
                                        {filters.search ? 'No matching ratings' : 'No ratings yet'}
                                    </p>
                                    <p className="text-xs">
                                        {filters.search ? 'Try a different search' : 'Click "New Evaluation" on the Suppliers page to add one'}
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            evaluations.data.map((evaluation) => {
                                const avg = average(evaluation);
                                return (
                                    <tr key={evaluation.id} className="hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                            {evaluation.evaluation_date}
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-foreground">
                                            {evaluation.supplier?.company_name ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {evaluation.purchase_order?.po_number ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {evaluation.requesting_office}
                                        </td>
                                        <td className="px-4 py-3 text-right text-muted-foreground">
                                            ₱{Number(evaluation.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-3 text-center text-muted-foreground">{evaluation.quality_of_goods}/5</td>
                                        <td className="px-4 py-3 text-center text-muted-foreground">{evaluation.timeliness}/5</td>
                                        <td className="px-4 py-3 text-center text-muted-foreground">{evaluation.compliance}/5</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col items-center gap-1">
                                                <Stars score={avg} />
                                                <span className={`text-xs font-semibold ${ratingColor(avg)}`}>
                                                    {avg.toFixed(1)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {evaluation.document_path !== null ? (
                                                <a
                                                    href={`/storage/${evaluation.document_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline text-xs font-medium"
                                                >
                                                    View
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">—</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {evaluations.data.length > 0 && (
                <div className="flex items-center justify-center gap-1 flex-wrap">
                    {evaluations.links.map((link, i) => (
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