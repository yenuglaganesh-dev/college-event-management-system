import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { Api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const { isAuthenticated, isStudent } = useAuth();
    const navigate = useNavigate();

    const categories = [
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
    ];

    useEffect(() => {
        Api.events.getAll().then((res) => {
            if (res.data) {
                setEvents(res.data);
                setFilteredEvents(res.data);
            }
        }).catch((err) => {
            showToast('Could not load events: ' + err.message, 'error');
        });
    }, []);

    useEffect(() => {
        let list = events;
        if (selectedCategory !== 'All') {
            list = list.filter((e) => e.category === selectedCategory);
        }
        if (selectedStatus !== 'All') {
            list = list.filter((e) => e.status === selectedStatus);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((e) =>
                e.title.toLowerCase().includes(q) ||
                e.venue.toLowerCase().includes(q) ||
                e.description.toLowerCase().includes(q)
            );
        }
        setFilteredEvents(list);
    }, [search, selectedCategory, selectedStatus, events]);

    const handleRegister = async (eventId) => {
        if (!isAuthenticated) {
            showToast('Please sign in to register for events', 'info');
            navigate('/login');
            return;
        }
        if (!isStudent) {
            showToast('Only verified students can register for events', 'error');
            return;
        }

        try {
            await Api.registrations.register(eventId);
            showToast('Registered successfully! View ticket under My Registrations.', 'success');
            navigate('/student/registrations');
        } catch (err) {
            showToast(err.message || 'Registration failed', 'error');
        }
    };

    return (
        <div className="section-container">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <span className="brand-badge" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
                    University Campus Events
                </span>
                <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--heading-color)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                    Browse Campus <span style={{ color: 'var(--primary-orange)' }}>Events Directory</span>
                </h1>
                <p style={{ color: 'var(--body-text)', maxWidth: '580px', margin: '0.5rem auto 0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
                    Explore hackathons, workshops, cultural fests, and sports leagues. Real-time capacity checks enforce attendance integrity.
                </p>
            </div>

            {/* Filter Section */}
            <div className="white-card" style={{ marginBottom: '2.5rem', padding: '1.25rem 1.75rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            className="form-control"
                            style={{ maxWidth: '300px' }}
                            placeholder="Search title, venue, topic..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            className="form-select"
                            style={{ maxWidth: '180px' }}
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                            ))}
                        </select>

                        <select
                            className="form-select"
                            style={{ maxWidth: '160px' }}
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                    </div>

                    <div style={{ fontSize: '0.9rem', color: 'var(--body-text)', fontWeight: 600 }}>
                        Showing <span style={{ color: 'var(--primary-orange)' }}>{filteredEvents.length}</span> of {events.length} events
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
                <div className="white-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <p style={{ color: 'var(--body-text)', fontSize: '1.1rem' }}>
                        No campus events found matching your search and filter criteria.
                    </p>
                </div>
            ) : (
                <div className="events-grid">
                    {filteredEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onRegister={handleRegister}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
