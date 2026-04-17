import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    deleteWatermark,
    fetchWatermarks,
    uploadWatermark,
    type Watermark,
} from '../services/watermarkApi';
import { fetchEngravings } from '../services/engravingApi';

const c = {
    bg: '#07090F',
    surface: '#0F1320',
    surfaceAlt: '#141929',
    border: '#1E2A45',
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4338CA',
    accent: '#06B6D4',
    text: '#F1F5F9',
    textMuted: '#94A3B8',
    textDim: '#64748B',
    error: '#F87171',
    errorBg: 'rgba(248,113,113,0.08)',
    errorBorder: 'rgba(248,113,113,0.25)',
    success: '#10B981',
};

const s: Record<string, React.CSSProperties> = {
    page: {
        minHeight: '100vh',
        background: c.bg,
        color: c.text,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        flex: 1,
        padding: '2.5rem',
        maxWidth: 1280,
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },

    // ── Upload form ───────────────────────────────────────────────────────────
    uploadCard: {
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: 16,
        padding: '1.5rem',
    },
    uploadCardTitle: {
        fontSize: '1rem',
        fontWeight: 700,
        marginBottom: '1.25rem',
        color: c.text,
    },
    uploadRow: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    uploadZone: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.85rem 1.1rem',
        borderRadius: 10,
        border: `1px dashed ${c.border}`,
        background: c.surfaceAlt,
        cursor: 'pointer',
    },
    uploadZoneIcon: { fontSize: '1.3rem', flexShrink: 0 },
    uploadZoneText: { fontSize: '0.875rem', color: c.textMuted },
    uploadZoneFilename: { fontSize: '0.875rem', color: c.text, fontWeight: 500 },
    nameInput: {
        padding: '0.7rem 1rem',
        borderRadius: 10,
        border: `1px solid ${c.border}`,
        background: c.surfaceAlt,
        color: c.text,
        fontSize: '0.875rem',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box' as const,
        marginTop: '0.75rem',
    },
    uploadBtn: {
        padding: '0.7rem 1.5rem',
        borderRadius: 10,
        border: 'none',
        background: `linear-gradient(135deg, ${c.primary}, ${c.primaryDark})`,
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.875rem',
        cursor: 'pointer',
        flexShrink: 0,
        boxShadow: `0 0 20px rgba(99,102,241,0.35)`,
        whiteSpace: 'nowrap',
    },
    uploadBtnDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
    uploadError: {
        marginTop: '0.75rem',
        padding: '0.65rem 1rem',
        borderRadius: 8,
        background: c.errorBg,
        border: `1px solid ${c.errorBorder}`,
        color: c.error,
        fontSize: '0.85rem',
    },

    // ── List ─────────────────────────────────────────────────────────────────
    listHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
    },
    listTitle: {
        fontSize: '1rem',
        fontWeight: 700,
        color: c.text,
    },
    listCount: {
        fontSize: '0.8rem',
        color: c.textDim,
        padding: '0.2rem 0.6rem',
        borderRadius: 100,
        background: c.surfaceAlt,
        border: `1px solid ${c.border}`,
    },

    // Empty state
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: 16,
        gap: '0.75rem',
        textAlign: 'center',
    },
    emptyIcon: { fontSize: '2.5rem' },
    emptyTitle: { fontSize: '1rem', fontWeight: 600, color: c.textMuted },
    emptyHint: { fontSize: '0.85rem', color: c.textDim },

    // Modal
    modalBackdrop: {
        position: 'fixed' as const,
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem',
    },
    modalBox: {
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: 18,
        overflow: 'hidden',
        maxWidth: '90vw',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column' as const,
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
    },
    modalHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        borderBottom: `1px solid ${c.border}`,
        gap: '1rem',
    },
    modalName: {
        fontSize: '0.95rem',
        fontWeight: 700,
        color: c.text,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
        flex: 1,
        minWidth: 0,
    },
    modalClose: {
        width: 32,
        height: 32,
        borderRadius: 8,
        border: `1px solid ${c.border}`,
        background: c.surfaceAlt,
        color: c.textMuted,
        fontSize: '1rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    modalImg: {
        display: 'block',
        maxWidth: '100%',
        maxHeight: 'calc(90vh - 60px)',
        objectFit: 'contain' as const,
    },

    // Watermark row
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1rem',
    },
    watermarkCard: {
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    thumbWrap: {
        width: '100%',
        aspectRatio: '16/9',
        background: c.surfaceAlt,
        overflow: 'hidden',
    },
    thumbImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    cardInfo: {
        padding: '0.9rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem',
    },
    cardName: {
        fontSize: '0.85rem',
        fontWeight: 600,
        color: c.text,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: 1,
        minWidth: 0,
    },
    deleteBtn: {
        padding: '0.35rem 0.75rem',
        borderRadius: 7,
        border: `1px solid rgba(248,113,113,0.3)`,
        background: 'rgba(248,113,113,0.08)',
        color: c.error,
        fontSize: '0.75rem',
        fontWeight: 600,
        cursor: 'pointer',
        flexShrink: 0,
    },
    deleteBtnDisabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
    },
    engravingsBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.2rem 0.55rem',
        borderRadius: 100,
        background: 'rgba(6,182,212,0.1)',
        border: '1px solid rgba(6,182,212,0.25)',
        color: c.accent,
        fontSize: '0.7rem',
        fontWeight: 600,
        cursor: 'pointer',
        flexShrink: 0,
        textDecoration: 'none',
    },
};

export function WatermarksPage() {
    const navigate = useNavigate();
    const [watermarks, setWatermarks] = useState<Watermark[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [watermarkName, setWatermarkName] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [previewWatermark, setPreviewWatermark] = useState<Watermark | null>(null);
    const [engravingCounts, setEngravingCounts] = useState<Record<string, number>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchWatermarks()
            .then(setWatermarks)
            .finally(() => setLoading(false));
        fetchEngravings()
            .then(list => {
                const counts: Record<string, number> = {};
                for (const e of list) {
                    counts[e.watermark_id] = (counts[e.watermark_id] ?? 0) + 1;
                }
                setEngravingCounts(counts);
            })
            .catch(() => {});
    }, []);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUploadError('');
        const file = e.target.files?.[0] ?? null;
        if (!file) { setSelectedFile(null); return; }

        const url = URL.createObjectURL(file);
        const img = new window.Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            if (img.naturalWidth !== img.naturalHeight) {
                setUploadError('The watermark must be square — width and height must be equal.');
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            } else {
                setSelectedFile(file);
            }
        };
        img.onerror = () => { URL.revokeObjectURL(url); setSelectedFile(file); };
        img.src = url;
    }

    async function handleUpload() {
        if (!selectedFile) return;
        setUploading(true);
        setUploadError('');
        try {
            const newWatermark = await uploadWatermark(selectedFile, watermarkName);
            setWatermarks(prev => [newWatermark, ...prev]);
            setSelectedFile(null);
            setWatermarkName('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    }

    async function handleDelete(id: string) {
        setDeletingId(id);
        try {
            await deleteWatermark(id);
            setWatermarks(prev => prev.filter(w => w.id !== id));
        } catch {
            // silently keep the item in the list on failure
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div style={s.page}>
            <main style={s.main}>
                {/* ── Upload form ── */}
                <div style={s.uploadCard}>
                    <div style={s.uploadCardTitle}>Upload a new watermark</div>
                    <div style={s.uploadRow}>
                        <div
                            style={s.uploadZone}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <span style={s.uploadZoneIcon}>📂</span>
                            {selectedFile
                                ? <span style={s.uploadZoneFilename}>{selectedFile.name}</span>
                                : <span style={s.uploadZoneText}>Click to select an image — JPEG, PNG, WebP · must be square</span>
                            }
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <button
                            style={{
                                ...s.uploadBtn,
                                ...(!selectedFile || !watermarkName.trim() || uploading ? s.uploadBtnDisabled : {}),
                            }}
                            disabled={!selectedFile || !watermarkName.trim() || uploading}
                            onClick={handleUpload}
                        >
                            {uploading ? 'Uploading…' : 'Upload'}
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Watermark name (required)"
                        value={watermarkName}
                        onChange={e => setWatermarkName(e.target.value)}
                        style={s.nameInput}
                    />
                    {uploadError && <div style={s.uploadError}>⚠ {uploadError}</div>}
                </div>

                {/* ── List ── */}
                <div>
                    <div style={s.listHeader}>
                        <span style={s.listTitle}>Your images</span>
                        {!loading && (
                            <span style={s.listCount}>{watermarks.length} total</span>
                        )}
                    </div>

                    {loading ? (
                        <div style={{ ...s.emptyState }}>
                            <span style={s.emptyIcon}>⏳</span>
                            <span style={s.emptyTitle}>Loading…</span>
                        </div>
                    ) : watermarks.length === 0 ? (
                        <div style={s.emptyState}>
                            <span style={s.emptyIcon}>🗂️</span>
                            <span style={s.emptyTitle}>No watermarks yet</span>
                            <span style={s.emptyHint}>Upload your first image using the form above.</span>
                        </div>
                    ) : (
                        <div style={s.grid}>
                            {watermarks.map(w => (
                                <div key={w.id} style={s.watermarkCard}>
                                    <div
                                        style={{ ...s.thumbWrap, cursor: 'pointer' }}
                                        onClick={() => setPreviewWatermark(w)}
                                    >
                                        <img
                                            src={w.thumbnail_url}
                                            alt={w.name}
                                            style={s.thumbImg}
                                        />
                                    </div>
                                    <div style={s.cardInfo}>
                                        <span style={s.cardName} title={w.name}>{w.name}</span>
                                        <span
                                            style={s.engravingsBadge}
                                            onClick={() => navigate(`/dashboard/engravings?watermark_id=${w.id}`)}
                                            title="View engravings with this watermark"
                                        >
                                            🖨️ {engravingCounts[w.id] ?? 0}
                                        </span>
                                        <button
                                            style={{
                                                ...s.deleteBtn,
                                                ...(deletingId === w.id ? s.deleteBtnDisabled : {}),
                                            }}
                                            disabled={deletingId === w.id}
                                            onClick={() => handleDelete(w.id)}
                                        >
                                            {deletingId === w.id ? '…' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {previewWatermark && (
                <div style={s.modalBackdrop} onClick={() => setPreviewWatermark(null)}>
                    <div style={s.modalBox} onClick={e => e.stopPropagation()}>
                        <div style={s.modalHeader}>
                            <span style={s.modalName} title={previewWatermark.name}>
                                {previewWatermark.name}
                            </span>
                            <button style={s.modalClose} onClick={() => setPreviewWatermark(null)}>✕</button>
                        </div>
                        <img
                            src={previewWatermark.image_url}
                            alt={previewWatermark.name}
                            style={s.modalImg}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
