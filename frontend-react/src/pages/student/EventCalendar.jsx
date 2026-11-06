import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function EventCalendar() {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        Api.events.getAll().then((res) => {
            if (res.data) setEvents(res.data);
        }).catch(() => {});
    }, []);

    // Group events by date
    const eventsByDate = events.reduce((acc, ev) => {
        const dateKey = ev.eventDate;
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(ev);
        return acc;
    }, {});

    const sortedDates = Object.keys(eventsByDate).sort();

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-user">
                    <div className="sidebar-user-name">{user?.fullName || 'Student'}</div>
                    <div className="sidebar-user-role">ID: {user?.studentId || 'Enrolled Student'}</div>
                </div>
                <ul className="sidebar-nav">
                    <li><NavLink to="/student" end className={({ isActive }) => isActive ? 'active' : ''}>Dashboard Overview</NavLink></li>
                    <li><NavLink to="/student/registrations" className={({ isActive }) => isActive ? 'active' : ''}>My Registrations</NavLink></li>
                    <li><NavLink to="/student/calendar" className={({ isActive }) => isActive ? 'active' : ''}>Event Calendar</NavLink></li>
                    <li><NavLink to="/student/certificates" className={({ isActive }) => isActive ? 'active' : ''}>My Certificates</NavLink></li>
                    <li><NavLink to="/student/profile" className={({ isActive }) => isActive ? 'active' : ''}>Student Profile</NavLink></li>
                    <li><NavLink to="/events">Explore Events</NavLink></li>
                </ul>
            </aside>

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div>
                        <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Campus Timetable</span>
                        <h1>Campus Event Calendar</h1>
                        <p>Timeline schedule of all upcoming technical conferences, workshops, and sports meets.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {sortedDates.length === 0 ? (
                        <div className="white-card" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--body-text)' }}>
                            No scheduled events found on the calendar.
                        </div>
                    ) : (
                        sortedDates.map((dateStr) => {
                            const dateObj = new Date(dateStr);
                            const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'long' });
                            const dayNum = dateObj.getDate();
                            const monthName = dateObj.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });

                            return (
                                <div key={dateStr} className="white-card" style={{ padding: '1.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                                        <div style={{
                                            background: 'var(--light-orange)',
                                            border: '1.5px solid var(--border-color)',
                                            borderRadius: 'var(--radius-lg)',
                                            padding: '0.5rem 1rem',
                                            textAlign: 'center',
                                            minWidth: '68px'
                                        }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-orange)', lineHeight: 1 }}>{dayNum}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--heading-color)', textTransform: 'uppercase', fontWeight: 700, marginTop: '0.2rem' }}>{monthName.split(' ')[0]}</div>
                                        </div>
                                        <div>
                                            <strong style={{ color: 'var(--heading-color)', fontSize: '1.2rem', fontWeight: 800 }}>{dayName}</strong>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--body-text)' }}>{dateStr}</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                                        {eventsByDate[dateStr].map((ev) => (
                                            <div
                                                key={ev.id}
                                                style={{
                                                    background: 'var(--light-orange-subtle)',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: 'var(--radius-md)',
                                                    padding: '1.25rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onClick={() => setSelectedEvent(ev)}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <span className="event-category-pill" style={{ position: 'static', fontSize: '0.7rem' }}>{ev.category}</span>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-orange)', fontWeight: 700 }}>{ev.eventTime}</span>
                                                </div>
                                                <h4 style={{ color: 'var(--heading-color)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>{ev.title}</h4>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--body-text)' }}>📍 {ev.venue}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Event Details Quick Dialog */}
                {selectedEvent && (
                    <div className="modal-backdrop" onClick={() => setSelectedEvent(null)}>
                        <div className="white-card" style={{ maxWidth: '520px', width: '100%', padding: '2.25rem', boxShadow: 'var(--shadow-lg)' }} onClick={(e) => e.stopPropagation()}>
                            <span className="event-category-pill" style={{ position: 'static', marginBottom: '0.75rem', display: 'inline-block' }}>{selectedEvent.category}</span>
                            <h3 style={{ color: 'var(--heading-color)', fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.5rem' }}>{selectedEvent.title}</h3>
                            <p style={{ color: 'var(--body-text)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{selectedEvent.description}</p>
                            <div style={{ fontSize: '0.9rem', color: 'var(--body-text)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                                <div>Venue: <strong style={{ color: 'var(--heading-color)' }}>{selectedEvent.venue}</strong></div>
                                <div>Schedule: <strong style={{ color: 'var(--heading-color)' }}>{selectedEvent.eventDate} at {selectedEvent.eventTime}</strong></div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <NavLink to={`/events/${selectedEvent.id}`} className="btn btn-primary" style={{ flex: 1, textAlign: 'center', padding: '0.7rem' }}>
                                    Open Full Event Page
                                </NavLink>
                                <button onClick={() => setSelectedEvent(null)} className="btn btn-secondary" style={{ padding: '0.7rem 1.25rem' }}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
