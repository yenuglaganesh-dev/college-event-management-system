import { useState, useEffect, useCallback, useMemo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    ViewIcon,
    Cancel01Icon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Search01Icon,
    ArrowExpandIcon,
    ArrowShrinkIcon,
    LinkSquare02Icon
} from '@hugeicons/core-free-icons';
import './Masonry.css';

export default function Masonry({
    items = [],
    columns = 3,
    categories = [
        'All',
        'Placement Events',
        'Technical Events',
        'Cultural Events',
        'Sports Events',
        'Hackathons',
        'Workshops',
        'Seminars',
        'Student Activities',
        'University Celebrations',
        'Guest Lectures',
        'Social Service Activities',
        'Academic Events',
        'Campus Life'
    ]
}) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const [visibleCount, setVisibleCount] = useState(12);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    const safeItems = Array.isArray(items) ? items : [];

    // Filter items based on selected category and live search term
    const filteredItems = useMemo(() => {
        return safeItems.filter((item) => {
            const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
            if (!matchesCat) return false;

            if (!searchTerm.trim()) return true;
            const q = searchTerm.toLowerCase();
            return (
                (item.title && item.title.toLowerCase().includes(q)) ||
                (item.caption && item.caption.toLowerCase().includes(q)) ||
                (item.eventDate && item.eventDate.toLowerCase().includes(q)) ||
                (item.category && item.category.toLowerCase().includes(q))
            );
        });
    }, [safeItems, selectedCategory, searchTerm]);

    // Sliced items for "Load More" pagination
    const displayedItems = useMemo(() => {
        return filteredItems.slice(0, visibleCount);
    }, [filteredItems, visibleCount]);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 12);
    };

    const showNext = useCallback(() => {
        if (lightboxIndex !== null) {
            setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
            setIsZoomed(false);
        }
    }, [lightboxIndex, filteredItems.length]);

    const showPrev = useCallback(() => {
        if (lightboxIndex !== null) {
            setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
            setIsZoomed(false);
        }
    }, [lightboxIndex, filteredItems.length]);

    const closeLightbox = useCallback(() => {
        setLightboxIndex(null);
        setIsZoomed(false);
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
            setIsFullscreen(false);
        }
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
            setIsFullscreen(true);
        } else {
            document.exitFullscreen().catch(() => {});
            setIsFullscreen(false);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (lightboxIndex === null) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex, showNext, showPrev, closeLightbox]);

    const currentItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

    // Find other photos linked to the same event ID for "Multiple photos per event"
    const eventPhotos = useMemo(() => {
        if (!currentItem || !currentItem.eventId) return [];
        return safeItems.filter((i) => i.eventId === currentItem.eventId);
    }, [currentItem, safeItems]);

    return (
        <div className="masonry-wrapper">
            {/* Search and Filters Header */}
            <div className="masonry-controls-section" style={{ marginBottom: '2rem' }}>
                {/* Search Bar */}
                <div style={{
                    maxWidth: '460px',
                    margin: '0 auto 1.5rem auto',
                    position: 'relative'
                }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search CUTM events, dates, topics..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setVisibleCount(12);
                            setLightboxIndex(null);
                        }}
                        style={{
                            paddingLeft: '2.75rem',
                            borderRadius: '999px',
                            background: '#FFFFFF',
                            borderColor: 'var(--border-color)',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--primary-orange)',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <HugeiconsIcon icon={Search01Icon} size={18} />
                    </div>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            style={{
                                position: 'absolute',
                                right: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'transparent',
                                border: 'none',
                                color: '#999',
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                            }}
                        >
                            &times;
                        </button>
                    )}
                </div>

                {/* 12 Category Filter Pills */}
                {categories && categories.length > 0 && (
                    <div className="masonry-filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`masonry-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setVisibleCount(12);
                                    setLightboxIndex(null);
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--body-text)' }}>
                    Showing <strong style={{ color: 'var(--primary-orange)' }}>{Math.min(visibleCount, filteredItems.length)}</strong> of <strong>{filteredItems.length}</strong> official photographs
                </div>
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 ? (
                <div className="masonry-empty" style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-color)'
                }}>
                    <p style={{ color: 'var(--body-text)', fontSize: '1.05rem', margin: 0 }}>
                        No campus photographs found matching &ldquo;{searchTerm || selectedCategory}&rdquo;.
                    </p>
                </div>
            ) : (
                <>
                    {/* Masonry Grid */}
                    <div className={`masonry-grid cols-${columns}`}>
                        {displayedItems.map((item, idx) => (
                            <div
                                key={item.id || idx}
                                className="masonry-card"
                                onClick={() => setLightboxIndex(idx)}
                            >
                                <div className="masonry-img-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title || 'CUTM Event photo'}
                                        loading="lazy"
                                        className="masonry-img"
                                        style={{ width: '100%', height: 'auto', display: 'block' }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/centurion-logo.png';
                                        }}
                                    />
                                    <div className="masonry-overlay">
                                        <div className="masonry-zoom-btn">
                                            <HugeiconsIcon icon={ViewIcon} size={18} />
                                        </div>
                                    </div>
                                </div>

                                {/* Title and event details displayed clearly below the image */}
                                <div className="masonry-card-details" style={{
                                    padding: '0.9rem 1.15rem 1.1rem 1.15rem',
                                    background: '#FFFFFF',
                                    borderTop: '1px solid var(--border-color)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', gap: '0.4rem', flexWrap: 'wrap' }}>
                                        <span className="masonry-category-badge" style={{ fontSize: '0.72rem' }}>{item.category}</span>
                                        {item.eventDate && (
                                            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                                                {item.eventDate}
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="masonry-title" style={{
                                        fontSize: '1.02rem',
                                        fontWeight: 700,
                                        color: 'var(--heading-color)',
                                        margin: '0.25rem 0 0.35rem 0',
                                        lineHeight: 1.35
                                    }}>
                                        {item.title}
                                    </h4>
                                    {item.caption && (
                                        <p style={{
                                            color: 'var(--body-text)',
                                            fontSize: '0.82rem',
                                            margin: 0,
                                            lineHeight: 1.45,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical'
                                        }}>
                                            {item.caption}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {visibleCount < filteredItems.length && (
                        <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '1.5rem' }}>
                            <button
                                onClick={handleLoadMore}
                                className="btn btn-outline-orange"
                                style={{
                                    padding: '0.75rem 2.25rem',
                                    fontSize: '0.95rem',
                                    fontWeight: 700,
                                    borderRadius: '999px'
                                }}
                            >
                                Load More Photographs ({filteredItems.length - visibleCount} remaining) &darr;
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Lightbox Modal with Full-Screen & Multi-Photo Carousel */}
            {currentItem && (
                <div className="masonry-lightbox-overlay" onClick={closeLightbox}>
                    <div
                        className="masonry-lightbox-dialog"
                        onClick={(e) => e.stopPropagation()}
                        style={{ maxWidth: isFullscreen ? '96vw' : '920px' }}
                    >
                        {/* Top controls */}
                        <div style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            display: 'flex',
                            gap: '0.5rem',
                            zIndex: 10
                        }}>
                            <button
                                className="lightbox-close-btn"
                                onClick={toggleFullscreen}
                                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                                style={{ position: 'static' }}
                            >
                                <HugeiconsIcon icon={isFullscreen ? ArrowShrinkIcon : ArrowExpandIcon} size={18} />
                            </button>
                            <button
                                className="lightbox-close-btn"
                                onClick={closeLightbox}
                                title="Close (Esc)"
                                style={{ position: 'static' }}
                            >
                                <HugeiconsIcon icon={Cancel01Icon} size={20} />
                            </button>
                        </div>

                        {/* Prev / Next navigation */}
                        <button
                            className="lightbox-nav-btn prev"
                            onClick={showPrev}
                            aria-label="Previous image"
                            title="Previous (Left arrow)"
                        >
                            <HugeiconsIcon icon={ArrowLeft01Icon} size={24} />
                        </button>

                        <div className="lightbox-image-wrapper">
                            <div style={{
                                overflow: 'hidden',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: '#0F172A',
                                cursor: 'zoom-in'
                            }} onClick={() => setIsZoomed(!isZoomed)}>
                                <img
                                    src={currentItem.imageUrl}
                                    alt={currentItem.title}
                                    className="lightbox-img"
                                    style={{
                                        transform: isZoomed ? 'scale(1.4)' : 'scale(1)',
                                        transition: 'transform 0.3s ease',
                                        maxHeight: isFullscreen ? '78vh' : '58vh'
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/centurion-logo.png';
                                    }}
                                />
                            </div>

                            <div className="lightbox-details" style={{ padding: '1.25rem 1.75rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                                    <span className="masonry-category-badge">{currentItem.category}</span>
                                    {currentItem.eventDate && (
                                        <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>
                                            &bull; {currentItem.eventDate}
                                        </span>
                                    )}
                                    {currentItem.permissionStatus === 'UNAVAILABLE' ? (
                                        <span style={{ fontSize: '0.75rem', color: '#dc2626', background: '#fee2e2', padding: '0.2rem 0.55rem', borderRadius: '6px', fontWeight: 700 }}>
                                            Official Photo Pending Publication
                                        </span>
                                    ) : (
                                        <span style={{ fontSize: '0.75rem', color: '#16a34a', background: '#dcfce7', padding: '0.2rem 0.55rem', borderRadius: '6px', fontWeight: 600 }}>
                                            Verified CUTM AP Photograph
                                        </span>
                                    )}
                                </div>

                                <h3 style={{ fontSize: '1.25rem', color: 'var(--heading-color)', margin: '0.25rem 0 0.5rem 0', fontWeight: 800 }}>
                                    {currentItem.title}
                                </h3>

                                {currentItem.caption && (
                                    <p style={{ color: 'var(--body-text)', fontSize: '0.92rem', lineHeight: 1.5, margin: '0 0 0.85rem 0' }}>
                                        {currentItem.caption}
                                    </p>
                                )}

                                {/* Multi-photo thumbnails for this event */}
                                {eventPhotos.length > 1 && (
                                    <div style={{ marginTop: '0.85rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--body-text)', fontWeight: 700, marginBottom: '0.4rem' }}>
                                            More Photos from this Event ({eventPhotos.length})
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
                                            {eventPhotos.map((ep) => {
                                                const matchIdx = filteredItems.findIndex(f => f.id === ep.id);
                                                const isCurrent = ep.id === currentItem.id;
                                                return (
                                                    <img
                                                        key={ep.id}
                                                        src={ep.imageUrl}
                                                        alt={ep.title}
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = '/centurion-logo.png';
                                                        }}
                                                        onClick={() => {
                                                            if (matchIdx !== -1) setLightboxIndex(matchIdx);
                                                        }}
                                                        style={{
                                                            width: '60px',
                                                            height: '42px',
                                                            objectFit: 'cover',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            border: isCurrent ? '2px solid var(--primary-orange)' : '1px solid var(--border-color)',
                                                            opacity: isCurrent ? 1 : 0.65,
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Attribution and Google Photos album link */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '0.75rem',
                                    borderTop: '1px solid var(--border-color)',
                                    paddingTop: '0.75rem',
                                    flexWrap: 'wrap',
                                    gap: '0.75rem'
                                }}>
                                    <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <img src="/centurion-logo.png" alt="CUTM" style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                                        <span>Centurion University AP &bull; Official Campus Archives</span>
                                    </div>

                                    {currentItem.officialSource && (
                                        <a
                                            href={currentItem.officialSource}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.35rem',
                                                fontSize: '0.82rem',
                                                color: 'var(--primary-orange)',
                                                fontWeight: 700,
                                                textDecoration: 'none'
                                            }}
                                        >
                                            <HugeiconsIcon icon={LinkSquare02Icon} size={15} />
                                            View Album on Google Photos &rarr;
                                        </a>
                                    )}

                                    <div className="lightbox-counter" style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                                        {lightboxIndex + 1} of {filteredItems.length}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            className="lightbox-nav-btn next"
                            onClick={showNext}
                            aria-label="Next image"
                            title="Next (Right arrow)"
                        >
                            <HugeiconsIcon icon={ArrowRight01Icon} size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
