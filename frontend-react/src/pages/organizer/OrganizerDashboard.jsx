import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';

export default function OrganizerDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [statsRes, eventsRes] = await Promise.all([
                api.dashboard.getOrganizerDashboard(),
                api.organizers.getMyEvents()
            ]);
            setStats(statsRes.data);
            setEvents(eventsRes.data || []);
        } catch (err) {
            toast.error(err.message || 'Failed to load organizer dashboard');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section-py" style={{ minHeight: '85vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Staff Portal</span>
                        <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800, color: 'var(--heading-color)', letterSpacing: '-0.02em' }}>
                            Organizer <span style={{ color: 'var(--primary-orange)' }}>Console</span>
                        </h1>
                        <p style={{ color: 'var(--body-text)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
                            Welcome back, <strong>{user?.fullName || 'Faculty Organizer'}</strong>. Manage assigned events, verify student tickets, and broadcast updates.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link to="/organizer/attendance" className="btn btn-primary">
                            Gate Check-In Scanner
                        </Link>
                        <Link to="/organizer/announcements" className="btn btn-secondary">
                            Post Announcement
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="spinner"></div>
                        <p style={{ color: 'var(--body-text)', marginTop: '1rem' }}>Loading organizer workspace...</p>
                    </div>
                ) : (
                    <>
                        {/* KPI Cards */}
                        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '2.5rem' }}>
                            <div className="white-card stat-card">
                                <span className="stat-label">Assigned Events</span>
                                <div className="stat-number">{stats?.assignedEvents ?? events.length}</div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--body-text)' }}>Under your supervision</span>
                            </div>

                            <div className="white-card stat-card">
                                <span className="stat-label">Total Reservations</span>
                                <div className="stat-number" style={{ color: 'var(--primary-orange)' }}>
                                    {events.reduce((sum, e) => sum + (e.registeredCount || 0), 0)}
                                </div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--body-text)' }}>Registered attendees</span>
                            </div>

                            <div className="white-card stat-card">
                                <span className="stat-label">Venue Capacity</span>
                                <div className="stat-number">
                                    {events.reduce((sum, e) => sum + (e.maxCapacity || 0), 0)}
                                </div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--body-text)' }}>Total available seats</span>
                            </div>
                        </div>

                        {/* Assigned Events Feed */}
                        <div className="white-card" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.35rem', marginTop: 0, marginBottom: '1.25rem', fontWeight: 800, color: 'var(--heading-color)' }}>Your Supervised Events</h3>
                            {events.length === 0 ? (
                                <p style={{ color: 'var(--body-text)', textAlign: 'center', padding: '2rem 0' }}>
                                    No events currently assigned.
                                </p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Event Title</th>
                                                <th>Date & Venue</th>
                                                <th>Occupancy</th>
                                                <th>Status</th>
                                                <th style={{ textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {events.map((evt) => {
                                                const registered = evt.registeredCount || 0;
                                                const capacity = evt.maxCapacity || 1;
                                                const pct = Math.min(100, Math.round((registered / capacity) * 100));

                                                return (
                                                    <tr key={evt.id}>
                                                        <td style={{ fontWeight: 700, color: 'var(--heading-color)' }}>
                                                            {evt.title}
                                                        </td>
                                                        <td>
                                                            <div style={{ fontWeight: 600, color: 'var(--heading-color)' }}>{evt.eventDate} ({evt.eventTime || 'TBA'})</div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--body-text)' }}>{evt.venue}</div>
                                                        </td>
                                                        <td style={{ minWidth: '140px' }}>
                                                            <div style={{ fontSize: '0.8rem', marginBottom: '0.2rem', color: 'var(--heading-color)', fontWeight: 600 }}>{registered} / {capacity} ({pct}%)</div>
                                                            <div className="capacity-bar-track" style={{ height: '6px' }}>
                                                                <div className="capacity-bar-fill" style={{ width: `${pct}%`, background: pct >= 100 ? '#dc2626' : 'var(--primary-orange)' }}></div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className="badge badge-approved">{evt.status}</span>
                                                        </td>
                                                        <td style={{ textAlign: 'right' }}>
                                                            <Link to="/organizer/attendance" className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.85rem' }}>
                                                                Scan Passes
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
