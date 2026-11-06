import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from '../../components/Toast';

export default function OrganizerEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const res = await api.organizers.getMyEvents();
            setEvents(res.data || []);
        } catch (err) {
            toast.error(err.message || 'Failed to load assigned events');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section-py" style={{ minHeight: '85vh' }}>
            <div className="container">
                <div style={{ marginBottom: '2.5rem' }}>
                    <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Roster</span>
                    <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800, color: 'var(--heading-color)', letterSpacing: '-0.02em' }}>
                        Assigned <span style={{ color: 'var(--primary-orange)' }}>Events</span>
                    </h1>
                    <p style={{ color: 'var(--body-text)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
                        Supervise registration quotas, schedules, and logistical details for your assigned events.
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="spinner"></div>
                        <p style={{ color: 'var(--body-text)', marginTop: '1rem' }}>Loading events...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="white-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--body-text)', fontSize: '1.05rem' }}>No events assigned to your profile yet.</p>
                    </div>
                ) : (
                    <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                        {events.map((evt) => (
                            <div key={evt.id} className="white-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <span className="badge badge-primary">{evt.category}</span>
                                        <span className="badge badge-approved">{evt.status}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', fontWeight: 800, color: 'var(--heading-color)' }}>{evt.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--body-text)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                                        {evt.description}
                                    </p>
                                    <div style={{ background: 'var(--light-orange-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--body-text)', marginBottom: '1rem', lineHeight: 1.6 }}>
                                        <div><strong>Date:</strong> {evt.eventDate} ({evt.eventTime})</div>
                                        <div><strong>Venue:</strong> {evt.venue}</div>
                                        <div><strong>Occupancy:</strong> {evt.registeredCount || 0} / {evt.maxCapacity} seats</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
