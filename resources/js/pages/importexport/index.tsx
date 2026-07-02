import { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MODULES = [
    { label: 'Suppliers', value: 'suppliers' },
    { label: 'Purchase Orders', value: 'purchase-orders' },
    { label: 'Deliveries', value: 'deliveries' },
    { label: 'IAR Reports', value: 'iars' },
    { label: 'Supplier Evaluations', value: 'supplier-evaluations' },
];

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
    const lines = text.trim().split('\n').filter(Boolean);
    if (lines.length === 0) return { headers: [], rows: [] };
    const headers = lines[0].split(',').map(h => h.replace(/\r/g, '').trim());
    const rows = lines.slice(1).map(line =>
        line.split(',').map(cell => cell.replace(/\r/g, '').trim())
    );
    return { headers, rows };
}

type Preview = { headers: string[]; rows: string[][] };
type ActiveSide = 'import' | 'export' | null;

export default function Index() {
    const [importModule, setImportModule] = useState('suppliers');
    const [exportModule, setExportModule] = useState('suppliers');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<Preview | null>(null);
    const [activeSide, setActiveSide] = useState<ActiveSide>(null);
    const [importing, setImporting] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [importResult, setImportResult] = useState<{ success?: string; error?: string } | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const selectClass = "w-full border border-input bg-background text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

    // Fetch export preview whenever export module changes and export is the active side
    useEffect(() => {
        if (activeSide !== 'export') return;
        fetchExportPreview(exportModule);
    }, [exportModule]);

    const fetchExportPreview = async (module: string) => {
        setExportLoading(true);
        setPreview(null);
        try {
            const res = await fetch('/importexport/preview?module=' + module, {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            const json = await res.json();
            if (json.headers && json.rows) {
                setPreview({ headers: json.headers, rows: json.rows });
            }
        } catch {
            setPreview({ headers: [], rows: [] });
        } finally {
            setExportLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null;
        setFile(selected);
        setImportResult(null);
        setPreview(null);
        setActiveSide('import');
        if (!selected) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target?.result as string;
            setPreview(parseCSV(text));
        };
        reader.readAsText(selected);
    };

    const handleImport = () => {
        if (!file) return;
        setImporting(true);
        setImportResult(null);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('module', importModule);
        router.post('/importexport/import', formData, {
            onSuccess: () => {
                setImportResult({ success: 'Import successful.' });
                setFile(null);
                setPreview(null);
                setActiveSide(null);
                if (fileRef.current) fileRef.current.value = '';
            },
            onError: (errors) => {
                setImportResult({ error: (Object.values(errors)[0] as string) ?? 'Import failed.' });
            },
            onFinish: () => setImporting(false),
        });
    };

    const handleExportModuleChange = (value: string) => {
        setExportModule(value);
        setActiveSide('export');
        fetchExportPreview(value);
    };

    const handleExportFocus = () => {
        if (activeSide !== 'export') {
            setActiveSide('export');
            fetchExportPreview(exportModule);
        }
    };

    const handleExport = () => {
        window.location.href = '/importexport/export?module=' + exportModule;
    };

    const previewTitle = activeSide === 'export'
        ? `Export Preview — ${MODULES.find(m => m.value === exportModule)?.label}`
        : activeSide === 'import'
        ? `Import Preview — ${file?.name ?? ''}`
        : 'Preview';

    return (
        <div className="p-6 space-y-6">
            <Head title="Import & Export" />

            <div>
                <h1 className="text-2xl font-bold text-foreground">Import / Export</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Bulk import CSV files or export existing records.
                </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-6 items-start">

                {/* LEFT: Import + Export stacked */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Import Card */}
                    <Card className={activeSide === 'import' ? 'ring-2 ring-primary' : ''}>
                        <CardHeader>
                            <CardTitle>Import Data</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium mb-1">Target Module</label>
                                <select
                                    value={importModule}
                                    onChange={e => {
                                        setImportModule(e.target.value);
                                        setPreview(null);
                                        setFile(null);
                                        if (fileRef.current) fileRef.current.value = '';
                                    }}
                                    className={selectClass}
                                >
                                    {MODULES.map(m => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">CSV File</label>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2 text-sm"
                                />
                            </div>

                            <div className="rounded-lg border border-border p-3 text-sm text-muted-foreground">
                                {file ? (
                                    <span className="text-foreground font-medium">{file.name}</span>
                                ) : (
                                    'No file selected.'
                                )}
                                {activeSide === 'import' && preview && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        ({preview.rows.length} rows, {preview.headers.length} columns)
                                    </span>
                                )}
                            </div>

                            {importResult?.success && (
                                <p className="text-sm text-green-600 dark:text-green-400">{importResult.success}</p>
                            )}
                            {importResult?.error && (
                                <p className="text-sm text-red-500">{importResult.error}</p>
                            )}

                            <Button
                                className="w-full"
                                onClick={handleImport}
                                disabled={!file || importing}
                            >
                                {importing ? 'Importing...' : 'Import CSV'}
                            </Button>

                        </CardContent>
                    </Card>

                    {/* Export Card */}
                    <Card className={activeSide === 'export' ? 'ring-2 ring-primary' : ''}>
                        <CardHeader>
                            <CardTitle>Export Data</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium mb-1">Target Module</label>
                                <select
                                    value={exportModule}
                                    onChange={e => handleExportModuleChange(e.target.value)}
                                    onFocus={handleExportFocus}
                                    className={selectClass}
                                >
                                    {MODULES.map(m => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                            </div>

                            {activeSide === 'export' && preview && (
                                <p className="text-xs text-muted-foreground">
                                    {preview.rows.length} records ready to export
                                </p>
                            )}

                            <Button
                                className="w-full"
                                onClick={handleExport}
                                disabled={exportLoading}
                            >
                                Export CSV
                            </Button>

                        </CardContent>
                    </Card>

                </div>

                {/* RIGHT: Full-height Preview */}
                <Card className="lg:col-span-3 lg:sticky lg:top-6">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>
                                {previewTitle}
                            </CardTitle>
                            {activeSide && (
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                    activeSide === 'import'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                }`}>
                                    {activeSide === 'import' ? 'Import' : 'Export'}
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {exportLoading ? (
                            <div className="h-[600px] rounded-lg border border-border flex items-center justify-center text-muted-foreground text-sm">
                                Loading preview...
                            </div>
                        ) : !preview ? (
                            <div className="h-[600px] rounded-lg border border-border flex items-center justify-center text-muted-foreground text-sm p-10">
                                Upload a CSV file to preview import data, or select a module in Export to preview what will be exported.
                            </div>
                        ) : preview.headers.length === 0 ? (
                            <div className="h-[600px] rounded-lg border border-border flex items-center justify-center text-muted-foreground text-sm">
                                No records found for this module.
                            </div>
                        ) : (
                            <div className="h-[600px] overflow-auto rounded-lg border border-border">
                                <table className="w-full text-xs">
                                    <thead className="bg-muted/50 sticky top-0">
                                        <tr>
                                            {preview.headers.map((h, i) => (
                                                <th key={i} className="text-left px-3 py-2 font-semibold text-muted-foreground whitespace-nowrap border-b border-border">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {preview.rows.map((row, ri) => (
                                            <tr key={ri} className="hover:bg-muted/40">
                                                {row.map((cell, ci) => (
                                                    <td key={ci} className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                                                        {cell || '—'}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}