import { useEffect, useLayoutEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { Api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';

export default function EventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [eventPhotos, setEventPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [rating, setRating] = useState(5);
    const [comments, setComments] = useState('');
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, isStudent } = useAuth();
    const navigate = useNavigate();

    // Scroll to top immediately on ID change before paint
    useLayoutEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
    }, [id]);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;

        Api.events.getById(id).then((res) => {
            if (res.data) setEvent(res.data);
            setLoading(false);
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }).catch((err) => {
            showToast('Event not found: ' + err.message, 'error');
            setLoading(false);
        });

        Api.gallery.getByEventId(id).then((res) => {
            if (res.data && res.data.length > 0) {
                setEventPhotos(res.data);
            }
        }).catch(() => {});

        Api.feedback.getEventFeedbacks(id).then((res) => {
            if (res.data) setFeedbacks(res.data);
        }).catch(() => {});
    }, [id]);

    const handleRegister = async () => {
        if (!isAuthenticated) {
            showToast('Please sign in to register for events', 'info');
            navigate('/login');
            return;
        }
        if (!isStudent) {
            showToast('Only enrolled students can register for events', 'error');
            return;
        }

        try {
            await Api.registrations.register(id);
            showToast('Registration confirmed! Recorded in MySQL database.', 'success');
            navigate('/student/registrations');
        } catch (err) {
            showToast(err.message || 'Registration failed', 'error');
        }
    };

    const handleJoinWaitlist = async () => {
        if (!isAuthenticated) {
            showToast('Please sign in to join waitlist', 'info');
            navigate('/login');
            return;
        }
        try {
            const res = await Api.waitlist.join(id);
            showToast(res.message || 'Joined waitlist successfully!', 'success');
        } catch (err) {
            showToast(err.message || 'Could not join waitlist', 'error');
        }
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated || !isStudent) {
            showToast('Please sign in as a student to submit feedback', 'error');
            return;
        }
        try {
            await Api.feedback.submit(id, rating, comments);
            showToast('Thank you for rating this campus event!', 'success');
            setComments('');
            Api.feedback.getEventFeedbacks(id).then((res) => {
                if (res.data) setFeedbacks(res.data);
            });
        } catch (err) {
            showToast(err.message || 'Feedback submission failed', 'error');
        }
    };

    if (loading) {
        return (
            <div className="section-container" style={{ textAlign: 'center', padding: '5rem' }}>
                <p style={{ color: 'var(--body-text)' }}>Loading event details from database...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="section-container" style={{ textAlign: 'center', padding: '5rem' }}>
                <h2 style={{ color: 'var(--heading-color)' }}>Event Not Found</h2>
                <NavLink to="/events" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    &larr; Back to Events Directory
                </NavLink>
            </div>
        );
    }

    const regCount = event.currentRegistrations || 0;
    const capacity = event.maxCapacity || 100;
    const pct = Math.min(100, Math.round((regCount / capacity) * 100));
    const isFull = regCount >= capacity;

    return (
        <div className="section-container">
            <NavLink to="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', color: 'var(--primary-orange)', fontWeight: 600 }}>
                &larr; Back to Events Directory
            </NavLink>

            <div className="event-details-grid">
                {/* Left Column: Media & Description */}
                <div>
                    <div style={{
                        borderRadius: 'var(--radius-xl)',
                        overflow: 'hidden',
                        marginBottom: '1.75rem',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-sm)',
                        background: 'var(--light-orange)'
                    }}>
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="event-details-hero-img"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/cutmap_events/cutmap_semicon_arena.jpg';
                            }}
                        />
                    </div>

                    <div className="white-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span className="event-category-pill" style={{ position: 'static' }}>{event.category}</span>
                            <span className={`badge ${event.status === 'ACTIVE' ? 'badge-approved' : 'badge-completed'}`} style={{
                                background: event.status === 'ACTIVE' ? '#DEF7EC' : '#F1F5F9',
                                color: event.status === 'ACTIVE' ? '#03543F' : '#475569',
                                border: '1px solid ' + (event.status === 'ACTIVE' ? '#BCF0DA' : '#E2E8F0')
                            }}>
                                {event.status}
                            </span>
                            {event.permissionStatus === 'VERIFIED_OFFICIAL_CUTMAP' ? (
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-orange)', background: 'var(--light-orange)', padding: '0.25rem 0.65rem', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
                                    &bull; Verified CUTM AP Official Photo
                                </span>
                            ) : (
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#DC2626', background: '#FEF2F2', padding: '0.25rem 0.65rem', borderRadius: '999px', border: '1px solid #FEE2E2' }}>
                                    &bull; Official Photo Pending Publication
                                </span>
                            )}
                        </div>

                        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--heading-color)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            {event.title}
                        </h1>

                        {event.officialSource && (
                            <div style={{ marginBottom: '1.25rem', fontSize: '0.88rem' }}>
                                <span style={{ color: 'var(--body-text)' }}>Official Source Reference: </span>
                                <a
                                    href={event.officialSource}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--primary-orange)', fontWeight: 600, textDecoration: 'underline' }}
                                >
                                    Centurion University AP Official Records &rarr;
                                </a>
                            </div>
                        )}

                        <h3 style={{ fontSize: '1.15rem', color: 'var(--heading-color)', marginBottom: '0.5rem', fontWeight: 700 }}>About this Event</h3>
                        <p style={{ color: 'var(--body-text)', lineHeight: 1.7, whiteSpace: 'pre-line', marginBottom: '1.75rem' }}>
                            {event.description}
                        </p>

                        <h3 style={{ fontSize: '1.15rem', color: 'var(--heading-color)', marginBottom: '0.5rem', fontWeight: 700 }}>Eligibility & Rules</h3>
                        <ul style={{ color: 'var(--body-text)', paddingLeft: '1.25rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                            <li>Open to all enrolled undergraduate and postgraduate students.</li>
                            <li>Carry your official college ID card and digital QR ticket for entrance validation.</li>
                            <li>Registrations are strictly non-transferable and verified at check-in gates.</li>
                        </ul>

                        {/* Official Event Photo Gallery (Multiple Photos per Event) */}
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', color: 'var(--heading-color)', margin: 0, fontWeight: 700 }}>
                                        Official Event Photographs {eventPhotos.length > 0 && `(${eventPhotos.length})`}
                                    </h3>
                                    <p style={{ color: 'var(--body-text)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                                        Captured by Centurion University AP official media cell &bull; Vizianagaram Campus.
                                    </p>
                                </div>
                                <NavLink to="/gallery" style={{ fontSize: '0.85rem', color: 'var(--primary-orange)', fontWeight: 700 }}>
                                    View Full Campus Gallery &rarr;
                                </NavLink>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                                {(eventPhotos.length > 0 ? eventPhotos : [{ id: 'main', imageUrl: event.imageUrl, title: event.title, caption: event.category }]).map((p, pIdx) => (
                                    <div
                                        key={p.id || pIdx}
                                        onClick={() => setSelectedPhoto(p)}
                                        style={{
                                            position: 'relative',
                                            height: '105px',
                                            borderRadius: 'var(--radius-md)',
                                            overflow: 'hidden',
                                            border: '1.5px solid var(--border-color)',
                                            cursor: 'pointer',
                                            boxShadow: 'var(--shadow-sm)',
                                            transition: 'transform 0.2s ease, border-color 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--primary-orange)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                                    >
                                        <img
                                            src={p.imageUrl}
                                            alt={p.title || event.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/centurion-logo.png';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Student Reviews & Feedback */}
                    <div className="white-card" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--heading-color)', marginBottom: '1.25rem', fontWeight: 700 }}>
                            Student Reviews & Ratings ({feedbacks.length})
                        </h3>

                        {feedbacks.length === 0 ? (
                            <p style={{ color: 'var(--body-text)', fontSize: '0.9rem' }}>No student reviews yet. Be the first to share your thoughts!</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                {feedbacks.map((fb) => (
                                    <div key={fb.id} style={{
                                        padding: '1.25rem',
                                        background: 'var(--hover-bg)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                            <span style={{ color: 'var(--primary-orange)', fontWeight: 700 }}>
                                                Score: {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)} ({fb.rating}/5)
                                            </span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--body-text)' }}>
                                                {new Date(fb.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p style={{ color: 'var(--heading-color)', fontSize: '0.95rem', margin: 0 }}>{fb.comments}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isAuthenticated && isStudent && (
                            <form onSubmit={handleFeedbackSubmit} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                                <h4 style={{ color: 'var(--heading-color)', fontSize: '1.05rem', marginBottom: '0.75rem', fontWeight: 700 }}>Leave a Rating</h4>
                                <div className="form-group">
                                    <label className="form-label">Rating</label>
                                    <select
                                        className="form-select"
                                        value={rating}
                                        onChange={(e) => setRating(Number(e.target.value))}
                                        style={{ maxWidth: '200px' }}
                                    >
                                        <option value={5}>5 Stars - Outstanding</option>
                                        <option value={4}>4 Stars - Very Good</option>
                                        <option value={3}>3 Stars - Good</option>
                                        <option value={2}>2 Stars - Fair</option>
                                        <option value={1}>1 Star - Needs Improvement</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Comments</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        placeholder="Share your experience or feedback..."
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.4rem' }}>
                                    Submit Feedback
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Right Column: Key Details & Registration Card */}
                <div>
                    <div className="white-card" style={{ padding: '2rem', position: 'sticky', top: '6rem' }}>
                        <h3 style={{ fontSize: '1.3rem', color: 'var(--heading-color)', marginBottom: '1.25rem', fontWeight: 800 }}>
                            Registration & Venue
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--body-text)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Event Date & Time</div>
                                <strong style={{ color: 'var(--heading-color)', fontSize: '1.05rem' }}>{event.eventDate} at {event.eventTime}</strong>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--body-text)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Venue Location</div>
                                <strong style={{ color: 'var(--heading-color)', fontSize: '1.05rem' }}>{event.venue}</strong>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--body-text)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Registration Deadline</div>
                                <strong style={{ color: 'var(--primary-orange)', fontSize: '1.05rem' }}>
                                    {new Date(event.registrationDeadline).toLocaleDateString()} {new Date(event.registrationDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </strong>
                            </div>
                        </div>

                        {/* Capacity meter */}
                        <div style={{ marginBottom: '1.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                                <span style={{ color: 'var(--body-text)', fontWeight: 600 }}>Live Seat Occupancy</span>
                                <strong style={{ color: 'var(--heading-color)' }}>{regCount} / {capacity} ({pct}%)</strong>
                            </div>
                            <div className="capacity-bar-track" style={{ height: '8px' }}>
                                <div
                                    className="capacity-bar-fill"
                                    style={{
                                        width: `${pct}%`,
                                        background: pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : 'var(--primary-orange)'
                                    }}
                                />
                            </div>
                            {isFull && (
                                <p style={{ fontSize: '0.85rem', color: '#dc2626', marginTop: '0.5rem', fontWeight: 600 }}>
                                    Event capacity has been reached. You may join the waitlist.
                                </p>
                            )}
                        </div>

                        {/* Action buttons */}
                        {event.status === 'COMPLETED' ? (
                            <div style={{
                                padding: '1.25rem',
                                background: '#F8FAFC',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center',
                                border: '1px solid #E2E8F0'
                            }}>
                                <div style={{ color: '#334155', fontWeight: 700, fontSize: '0.98rem', marginBottom: '0.25rem' }}>
                                    Event Concluded
                                </div>
                                <p style={{ color: '#64748B', fontSize: '0.84rem', margin: 0, lineHeight: 1.5 }}>
                                    This CUTM AP event took place on {event.eventDate}. Registrations are officially completed.
                                </p>
                            </div>
                        ) : isFull ? (
                            <button
                                onClick={handleJoinWaitlist}
                                className="btn btn-outline-orange"
                                style={{ width: '100%', padding: '0.85rem' }}
                            >
                                Join Participant Waitlist
                            </button>
                        ) : (
                            <button
                                onClick={handleRegister}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '0.85rem', fontSize: '1.05rem', fontWeight: 700 }}
                            >
                                Register for Event
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Photo Lightbox Preview */}
            {selectedPhoto && (
                <div
                    onClick={() => setSelectedPhoto(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1.5rem'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: '#FFFFFF',
                            borderRadius: 'var(--radius-xl)',
                            maxWidth: '820px',
                            width: '100%',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-xl)',
                            border: '1.5px solid var(--border-color)',
                            position: 'relative'
                        }}
                    >
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            style={{
                                position: 'absolute',
                                top: '0.75rem',
                                right: '0.75rem',
                                background: '#FFFFFF',
                                border: '1px solid var(--border-color)',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '1.25rem',
                                color: 'var(--heading-color)',
                                zIndex: 10
                            }}
                        >
                            &times;
                        </button>
                        <img
                            src={selectedPhoto.imageUrl}
                            alt={selectedPhoto.title || event.title}
                            style={{
                                width: '100%',
                                maxHeight: '60vh',
                                objectFit: 'contain',
                                background: '#0F172A',
                                display: 'block'
                            }}
                        />
                        <div style={{ padding: '1.25rem 1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div>
                                    <h4 style={{ margin: 0, color: 'var(--heading-color)', fontSize: '1.1rem', fontWeight: 700 }}>
                                        {selectedPhoto.title || event.title}
                                    </h4>
                                    {selectedPhoto.caption && (
                                        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--body-text)', fontSize: '0.88rem' }}>
                                            {selectedPhoto.caption}
                                        </p>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                    Centurion University AP &bull; Official Archive
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
