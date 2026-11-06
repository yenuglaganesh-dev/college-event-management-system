import { useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ScrollStack from '../components/ScrollStack/ScrollStack';
import Masonry from '../components/Masonry/Masonry';
import EventCard from '../components/EventCard';
import { Api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';

// Animated Count-Up Hook
function CountUpNumber({ end, duration = 1200 }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        let animationFrame;
        const target = Number(end) || 0;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) {
                animationFrame = requestAnimationFrame(step);
            } else {
                setCount(target);
            }
        };

        animationFrame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <span>{count}</span>;
}

export default function Home() {
    const [events, setEvents] = useState([]);
    const [galleryPhotos, setGalleryPhotos] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [stats, setStats] = useState({ totalEvents: 5, totalStudents: 1, totalRegistrations: 4 });
    const { isAuthenticated, isStudent } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        Api.events.getAll().then((res) => {
            if (res.data) setEvents(res.data);
        }).catch(() => {});

        Api.gallery.getPhotos().then((res) => {
            if (res.data) setGalleryPhotos(res.data);
        }).catch(() => {});

        Api.announcements.getActive().then((res) => {
            if (res.data) setAnnouncements(res.data);
        }).catch(() => {});

        Api.dashboard.getPublicStats().then((res) => {
            if (res.data) setStats(res.data);
        }).catch(() => {});
    }, []);

    const handleRegister = async (eventId) => {
        if (!isAuthenticated) {
            showToast('Please sign in as a student to register', 'info');
            navigate('/login');
            return;
        }
        if (!isStudent) {
            showToast('Only students can register for events', 'error');
            return;
        }

        try {
            await Api.registrations.register(eventId);
            showToast('Event registration submitted successfully!', 'success');
            navigate('/student/registrations');
        } catch (err) {
            showToast(err.message || 'Registration failed', 'error');
        }
    };

    // Hero title word list for word-by-word reveal
    const heroWords = [
        { text: 'Discover,', highlight: false },
        { text: 'Participate', highlight: false },
        { text: '&', highlight: false },
        { text: 'Celebrate', highlight: false },
        { text: 'Campus', highlight: true },
        { text: 'Excellence.', highlight: true }
    ];

    return (
        <div className="page-transition" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Subtle floating decorative orange gradient shapes */}
            <div className="decorative-orb decorative-orb-1" />
            <div className="decorative-orb decorative-orb-2" />

            {/* Hero Section */}
            <section style={{ position: 'relative', minHeight: '82vh', display: 'flex', alignItems: 'center', padding: '4rem 1.5rem 3rem 1.5rem' }}>
                <div className="section-container" style={{ textAlign: 'center', width: '100%' }}>
                    {/* Badge */}
                    <div className="animate-fade-up">
                        <span className="role-badge" style={{ marginBottom: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 1rem', fontSize: '0.8rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-orange)', display: 'inline-block' }}></span>
                            Official University Event Hub &bull; 2026 Academic Season
                        </span>
                    </div>

                    {/* Word-by-word reveal heading */}
                    <h1 style={{
                        fontSize: 'clamp(2.4rem, 5.2vw, 4.25rem)',
                        fontWeight: 900,
                        letterSpacing: '-0.035em',
                        lineHeight: 1.15,
                        color: 'var(--heading-color)',
                        maxWidth: '920px',
                        margin: '0 auto 1.5rem auto'
                    }}>
                        {heroWords.map((word, idx) => (
                            <span
                                key={idx}
                                className={`word-reveal-item ${word.highlight ? 'word-highlight' : ''}`}
                                style={{ animationDelay: `${0.04 * idx}s`, marginRight: '0.35rem' }}
                            >
                                {word.text}
                            </span>
                        ))}
                    </h1>

                    {/* Subtitle with fade-in and slide-up */}
                    <p className="animate-fade-up delay-4" style={{
                        fontSize: '1.15rem',
                        color: 'var(--body-text)',
                        maxWidth: '680px',
                        margin: '0 auto 2.25rem auto',
                        lineHeight: 1.6
                    }}>
                        A unified platform for student participation, live seat allocation, QR-verified attendance, and instant faculty governance backed by MySQL.
                    </p>

                    {/* Action Buttons */}
                    <div className="animate-fade-up delay-5" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <NavLink to="/events" className="btn btn-primary btn-lg btn-pill">
                            Explore All Events &rarr;
                        </NavLink>
                        <NavLink to="/login" className="btn btn-secondary btn-lg btn-pill">
                            Student Sign In
                        </NavLink>
                        <NavLink to="/admin-login" className="btn btn-outline-orange btn-lg btn-pill">
                            Admin Portal
                        </NavLink>
                    </div>

                    {/* Live Statistics Cards with Count-Up Animation */}
                    <div className="animate-fade-up delay-5" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '1.5rem',
                        marginTop: '4rem',
                        maxWidth: '900px',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}>
                        <div className="stat-card">
                            <div className="stat-number" style={{ color: 'var(--primary-orange)' }}>
                                <CountUpNumber end={events.length || stats.totalEvents || 5} />
                            </div>
                            <div className="stat-label">Active Campus Events</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Currently open for booking</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-number">
                                <CountUpNumber end={stats.totalRegistrations || 4} />
                            </div>
                            <div className="stat-label">Total Registrations</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Stored in MySQL tables</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-number" style={{ color: 'var(--status-approved-text)' }}>
                                100%
                            </div>
                            <div className="stat-label">MySQL Live Sync</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Real-time ACID compliance</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ScrollStack Section: Featured Campus Events */}
            <section className="section-container" style={{ paddingTop: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <span className="role-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                        Curated Highlights
                    </span>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--heading-color)' }}>
                        Featured Events & Announcements
                    </h2>
                    <p style={{ color: 'var(--body-text)', maxWidth: '540px', margin: '0.5rem auto 0 auto' }}>
                        Pin-stacked card transitions powered by the clean white & orange ScrollStack deck.
                    </p>
                </div>

                <ScrollStack itemDistance={30} itemScale={0.03} stackPosition={100}>
                    {events.slice(0, 3).map((event) => (
                        <div key={event.id} className="scroll-stack-card" style={{ padding: '2.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
                                <div>
                                    <span className="event-category-pill" style={{ position: 'static', marginBottom: '0.75rem' }}>
                                        {event.category}
                                    </span>
                                    <h3 style={{ fontSize: '1.85rem', color: 'var(--heading-color)', marginBottom: '0.5rem', fontWeight: 800 }}>
                                        {event.title}
                                    </h3>
                                    <p style={{ color: 'var(--body-text)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                                        {event.description}
                                    </p>
                                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--primary-orange)', fontWeight: 600, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                        <span>Venue: {event.venue}</span>
                                        <span>Date: {event.eventDate}</span>
                                        <span>Time: {event.eventTime}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <NavLink to={`/events/${event.id}`} className="btn btn-primary btn-pill">
                                            View Details &rarr;
                                        </NavLink>
                                        <button onClick={() => handleRegister(event.id)} className="btn btn-secondary btn-pill">
                                            Quick Register
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <img
                                        src={event.imageUrl}
                                        alt={event.title}
                                        style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </ScrollStack>
            </section>

            {/* Campus Events Directory Preview */}
            <section className="section-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--heading-color)' }}>
                            Upcoming Campus Events
                        </h2>
                        <p style={{ color: 'var(--body-text)' }}>
                            Register now to claim your reserved seat before participant limits are reached.
                        </p>
                    </div>
                    <NavLink to="/events" className="btn btn-outline-orange btn-sm btn-pill">
                        Browse All Events &rarr;
                    </NavLink>
                </div>

                <div className="events-grid">
                    {events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onRegister={handleRegister}
                        />
                    ))}
                </div>
            </section>

            {/* Masonry Event Photo Gallery Section */}
            <section className="section-container">
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <span className="role-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                        Live Campus Photography
                    </span>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--heading-color)' }}>
                        Event Photo Gallery & Memories
                    </h2>
                    <p style={{ color: 'var(--body-text)', maxWidth: '580px', margin: '0.5rem auto 0 auto' }}>
                        Interactive multi-column gallery with category filters and fullscreen Lightbox view.
                    </p>
                </div>

                <Masonry items={galleryPhotos} columns={3} />
            </section>

            {/* Active Campus Announcements */}
            {announcements.length > 0 && (
                <section className="section-container" style={{ paddingTop: 0 }}>
                    <div className="white-card" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.35rem', color: 'var(--heading-color)', marginBottom: '1.25rem' }}>
                            Campus Activity Announcements
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {announcements.map((ann) => (
                                <div key={ann.id} style={{
                                    padding: '1rem 1.25rem',
                                    background: 'var(--light-orange-subtle)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                        <strong style={{ color: 'var(--heading-color)', fontSize: '1rem' }}>{ann.title}</strong>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--primary-orange)', fontWeight: 600 }}>By {ann.createdBy}</span>
                                    </div>
                                    <p style={{ color: 'var(--body-text)', fontSize: '0.875rem', margin: 0 }}>
                                        {ann.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
