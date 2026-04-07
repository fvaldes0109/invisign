import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    deleteImage,
    fetchImages,
    uploadImage,
    type UserImage,
} from '../services/imageApi';

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
    topbar: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.1rem 2.5rem',
        borderBottom: `1px solid ${c.border}`,
        background: 'rgba(7,9,15,0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    backLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        textDecoration: 'none',
        color: c.textMuted,
        fontSize: '0.85rem',
        fontWeight: 500,
        padding: '0.4rem 0.8rem',
        borderRadius: 8,
        border: `1px solid ${c.border}`,
        background: c.surface,
    },
    topbarTitle: {
        fontSize: '1rem',
        fontWeight: 700,
        color: c.text,
        letterSpacing: '-0.02em',
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
        background: `linear-gradient(135deg, ${c.accent}, #0891B2)`,
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.875rem',
        cursor: 'pointer',
        flexShrink: 0,
        boxShadow: `0 0 20px rgba(6,182,212,0.35)`,
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

    // Image grid
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1rem',
    },
    imageCard: {
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
};

export function ImagesPage() {
    const [images, setImages] = useState<UserImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageName, setImageName] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [previewImage, setPreviewImage] = useState<UserImage | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchImages()
            .then(setImages)
            .finally(() => setLoading(false));
    }, []);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUploadError('');
        setSelectedFile(e.target.files?.[0] ?? null);
    }

    async function handleUpload() {
        if (!selectedFile) return;
        setUploading(true);
        setUploadError('');
        try {
            const newImage = await uploadImage(selectedFile, imageName);
            setImages(prev => [newImage, ...prev]);
            setSelectedFile(null);
            setImageName('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch {
            setUploadError('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    }

    async function handleDelete(id: string) {
        setDeletingId(id);
        try {
            await deleteImage(id);
            setImages(prev => prev.filter(img => img.id !== id));
        } catch {
            // silently keep the item in the list on failure
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div style={s.page}>
            <header style={s.topbar}>
                <Link to="/dashboard" style={s.backLink}>← Dashboard</Link>
                <span style={s.topbarTitle}>My Images</span>
            </header>

            <main style={s.main}>
                {/* ── Upload form ── */}
                <div style={s.uploadCard}>
                    <div style={s.uploadCardTitle}>Upload a new image</div>
                    <div style={s.uploadRow}>
                        <div
                            style={s.uploadZone}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <span style={s.uploadZoneIcon}>📂</span>
                            {selectedFile
                                ? <span style={s.uploadZoneFilename}>{selectedFile.name}</span>
                                : <span style={s.uploadZoneText}>Click to select an image — JPEG, PNG, WebP</span>
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
                                ...(!selectedFile || !imageName.trim() || uploading ? s.uploadBtnDisabled : {}),
                            }}
                            disabled={!selectedFile || !imageName.trim() || uploading}
                            onClick={handleUpload}
                        >
                            {uploading ? 'Uploading…' : 'Upload'}
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Image name (required)"
                        value={imageName}
                        onChange={e => setImageName(e.target.value)}
                        style={s.nameInput}
                    />
                    {uploadError && <div style={s.uploadError}>⚠ {uploadError}</div>}
                </div>

                {/* ── List ── */}
                <div>
                    <div style={s.listHeader}>
                        <span style={s.listTitle}>Your images</span>
                        {!loading && (
                            <span style={s.listCount}>{images.length} total</span>
                        )}
                    </div>

                    {loading ? (
                        <div style={s.emptyState}>
                            <span style={s.emptyIcon}>⏳</span>
                            <span style={s.emptyTitle}>Loading…</span>
                        </div>
                    ) : images.length === 0 ? (
                        <div style={s.emptyState}>
                            <span style={s.emptyIcon}>🖼️</span>
                            <span style={s.emptyTitle}>No images yet</span>
                            <span style={s.emptyHint}>Upload your first image using the form above.</span>
                        </div>
                    ) : (
                        <div style={s.grid}>
                            {images.map(img => (
                                <div key={img.id} style={s.imageCard}>
                                    <div
                                        style={{ ...s.thumbWrap, cursor: 'pointer' }}
                                        onClick={() => setPreviewImage(img)}
                                    >
                                        <img
                                            src={img.thumbnail_url}
                                            alt={img.name}
                                            style={s.thumbImg}
                                        />
                                    </div>
                                    <div style={s.cardInfo}>
                                        <span style={s.cardName} title={img.name}>{img.name}</span>
                                        <button
                                            style={{
                                                ...s.deleteBtn,
                                                ...(deletingId === img.id ? s.deleteBtnDisabled : {}),
                                            }}
                                            disabled={deletingId === img.id}
                                            onClick={() => handleDelete(img.id)}
                                        >
                                            {deletingId === img.id ? '…' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {previewImage && (
                <div style={s.modalBackdrop} onClick={() => setPreviewImage(null)}>
                    <div style={s.modalBox} onClick={e => e.stopPropagation()}>
                        <div style={s.modalHeader}>
                            <span style={s.modalName} title={previewImage.name}>
                                {previewImage.name}
                            </span>
                            <button style={s.modalClose} onClick={() => setPreviewImage(null)}>✕</button>
                        </div>
                        <img
                            src={previewImage.image_url}
                            alt={previewImage.name}
                            style={s.modalImg}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
