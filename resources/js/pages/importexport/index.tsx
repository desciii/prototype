import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ImportDialog from '@/components/ImportExport/ImportDialog';
import ExportDialog from '@/components/ImportExport/ExportDialog';
import { Upload, Download } from 'lucide-react';
import { Head } from '@inertiajs/react';

export default function Index() {
    const [importOpen, setImportOpen] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);

    return (
        <div className="p-6 space-y-6">

            <Head title="Import and Export" />
            <div>
                <h1 className="text-2xl font-bold text-foreground">Import / Export</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Bulk import data via CSV or export records for external use
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* Import Card */}
                <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                <Upload className="size-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-foreground">Import CSV</h2>
                                <p className="text-xs text-muted-foreground">
                                    Upload a CSV file to bulk insert records
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Supported modules: Suppliers, Purchase Orders, Deliveries, IAR Reports.
                            CSV must include column headers matching the database fields.
                        </p>
                    </div>

                    <Button onClick={() => setImportOpen(true)} className="w-full mt-6">
                        <Upload className="size-4 mr-2" />
                        Import CSV
                    </Button>
                </div>

                {/* Export Card */}
                <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                                <Download className="size-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-foreground">Export CSV</h2>
                                <p className="text-xs text-muted-foreground">
                                    Download records as a CSV file
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Export all records from any module as a downloadable CSV file.
                            Useful for backups or reporting.
                        </p>
                    </div>

                    <Button
                        onClick={() => setExportOpen(true)}
                        variant="outline"
                        className="w-full mt-6"
                    >
                        <Download className="size-4 mr-2" />
                        Export CSV
                    </Button>
                </div>

            </div>

            <ImportDialog open={importOpen} onOpenChange={setImportOpen} />
            <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
        </div>
    );
}