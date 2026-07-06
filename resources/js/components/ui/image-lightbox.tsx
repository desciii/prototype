// components/ui/image-lightbox.tsx
import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

interface Props {
    src: string | null;
    onClose: () => void;
}

export default function ImageLightbox({ src, onClose }: Props) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!src) return;
        // trigger enter transition on next tick
        const raf = requestAnimationFrame(() => setVisible(true));
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('keydown', handleKey);
        };
    }, [src, onClose]);

    useEffect(() => {
        if (!src) setVisible(false);
    }, [src]);

    if (!src) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 transition-opacity duration-200 ${
                visible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            {/* Top action bar */}
            <div
                className="absolute top-0 left-0 right-0 flex items-center justify-end gap-2 p-4 sm:p-5"
                onClick={(e) => e.stopPropagation()}
            >
                <a
                    href={src}
                    download
                    className="flex items-center justify-center size-9 rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors"
                    title="Download"
                >
                    <Download className="size-4" />
                </a>
                <button
                    onClick={onClose}
                    className="flex items-center justify-center size-9 rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors"
                    title="Close"
                >
                    <X className="size-4" />
                </button>
            </div>

            {/* Image */}
            <img
                src={src}
                alt="preview"
                className={`max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl transition-transform duration-200 ${
                    visible ? 'scale-100' : 'scale-95'
                }`}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}