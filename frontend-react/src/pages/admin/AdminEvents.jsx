import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from '../../components/Toast';

export default function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: '',
        category: 'Technical',
        description: '',
        venue: '',
        eventDate: '',
        eventTime: '10:00 AM',
        registrationDeadline: '',
        maxCapacity: 100,
        status: 'ACTIVE',
        imageUrl: ''
    });

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const res = await api.events.getAll();
            setEvents(res.data || []);
        } catch (err) {
            toast.error(err.message || 'Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditingEvent(null);
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 7);
        const dateStr = defaultDate.toISOString().slice(0, 10);
        const deadlineStr = `${dateStr}T23:59`;

        setForm({
            title: '',
            category: 'Technical',
            description: '',
            venue: 'Main Auditorium, Campus North',
            eventDate: dateStr,
            eventTime: '10:00 AM - 04:00 PM',
            registrationDeadline: deadlineStr,
            maxCapacity: 150,
            status: 'ACTIVE',
            imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'
        });
        setModalOpen(true);
    };

    const handleOpenEdit = (evt) => {
        setEditingEvent(evt);
        let deadlineStr = evt.registrationDeadline;
        if (deadlineStr && deadlineStr.length > 16) {
            deadlineStr = deadlineStr.slice(0, 16);
        }
        setForm({
            title: evt.title,
            category: evt.category,
            description: evt.description,
            venue: evt.venue,
            eventDate: evt.eventDate,
            eventTime: evt.eventTime || '10:00 AM',
            registrationDeadline: deadlineStr || `${evt.eventDate}T23:59`,
            maxCapacity: evt.maxCapacity || 100,
            status: evt.status || 'ACTIVE',
            imageUrl: evt.imageUrl || ''
        });
        setModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const payload = {
                ...form,
                maxCapacity: parseInt(form.maxCapacity, 10),
                registrationDeadline: form.registrationDeadline ? `${form.registrationDeadline}:00` : null
            };

            if (editingEvent) {
                await api.events.update(editingEvent.id, payload);
                toast.success('Event updated successfully');
            } else {
                await api.events.create(payload);
                toast.success('Event published successfully');
            }
            setModalOpen(false);
            await loadEvents();
        } catch (err) {
            toast.error(err.message || 'Operation failed');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete event "${title}"? This will archive all associated attendee records.`)) {
            return;
        }
        try {
            await api.events.delete(id);
            toast.success('Event deleted');
            await loadEvents();
        } catch (err) {
            toast.error(err.message || 'Failed to delete event');
        }
    };

    return (
        <div className="section-py" style={{ minHeight: '85vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Catalogue</span>
                        <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800, color: 'var(--heading-color)', letterSpacing: '-0.02em' }}>
                            Events <span style={{ color: 'var(--primary-orange)' }}>Management</span>
                        </h1>
                        <p style={{ color: 'var(--body-text)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
                            Schedule, update, and manage collegiate hackathons, symposiums, and workshops.
                        </p>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
                        + Add New Event
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="spinner"></div>
                        <p style={{ color: 'var(--body-text)', marginTop: '1rem' }}>Loading event directory...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="white-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--body-text)', fontSize: '1.05rem', marginBottom: '1.25rem' }}>No events listed in the database.</p>
                        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
                            Create First Event
                        </button>
                    </div>
                ) : (
                    <div className="white-card" style={{ padding: '2rem' }}>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Event Details</th>
                                        <th>Category</th>
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
                                                <td>
                                                    <div style={{ fontWeight: 700, color: 'var(--heading-color)', fontSize: '1.05rem' }}>{evt.title}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--body-text)', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {evt.description}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="event-category-pill" style={{ position: 'static', fontSize: '0.75rem' }}>{evt.category}</span>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--heading-color)', fontWeight: 600 }}>{evt.eventDate} ({evt.eventTime || 'TBA'})</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--body-text)' }}>{evt.venue}</div>
                                                </td>
                                                <td style={{ minWidth: '140px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                                                        <span style={{ fontWeight: 600 }}>{registered} / {capacity}</span>
                                                        <span style={{ color: pct >= 100 ? '#dc2626' : 'var(--primary-orange)', fontWeight: 700 }}>{pct}%</span>
                                                    </div>
                                                    <div className="capacity-bar-track" style={{ height: '6px' }}>
                                                        <div className="capacity-bar-fill" style={{ width: `${pct}%`, background: pct >= 100 ? '#dc2626' : 'var(--primary-orange)' }}></div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${evt.status === 'ACTIVE' ? 'badge-approved' : 'badge-pending'}`}>
                                                        {evt.status}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary btn-sm"
                                                            style={{ padding: '0.3rem 0.75rem' }}
                                                            onClick={() => handleOpenEdit(evt)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary btn-sm"
                                                            style={{ padding: '0.3rem 0.75rem', color: '#dc2626', borderColor: '#fca5a5' }}
                                                            onClick={() => handleDelete(evt.id, evt.title)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Event Form Modal */}
                {modalOpen && (
                    <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
                        <div 
                            className="white-card" 
                            style={{ maxWidth: '680px', width: '92%', padding: '2.5rem', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 0, marginBottom: '1.5rem', color: 'var(--heading-color)' }}>
                                {editingEvent ? 'Modify Event Details' : 'Publish New Collegiate Event'}
                            </h3>

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label className="form-label">Event Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="e.g. National Hackathon 2026"
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                                    <div>
                                        <label className="form-label">Category *</label>
                                        <select name="category" className="form-select" value={form.category} onChange={handleChange} required>
                                            <option value="Technical">Technical</option>
                                            <option value="Cultural">Cultural</option>
                                            <option value="Sports">Sports</option>
                                            <option value="Workshop">Workshop</option>
                                            <option value="Conference">Conference</option>
                                            <option value="Community">Community</option>
                                            <option value="Seminar">Seminar</option>
                                            <option value="Competition">Competition</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Status *</label>
                                        <select name="status" className="form-select" value={form.status} onChange={handleChange} required>
                                            <option value="ACTIVE">ACTIVE</option>
                                            <option value="DRAFT">DRAFT</option>
                                            <option value="COMPLETED">COMPLETED</option>
                                            <option value="CANCELLED">CANCELLED</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label className="form-label">Description *</label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="3"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Detailed event scope and guidelines..."
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                                    <div>
                                        <label className="form-label">Venue Location *</label>
                                        <input
                                            type="text"
                                            name="venue"
                                            className="form-control"
                                            value={form.venue}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Event Date *</label>
                                        <input
                                            type="date"
                                            name="eventDate"
                                            className="form-control"
                                            value={form.eventDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                                    <div>
                                        <label className="form-label">Event Time *</label>
                                        <input
                                            type="text"
                                            name="eventTime"
                                            className="form-control"
                                            value={form.eventTime}
                                            onChange={handleChange}
                                            placeholder="e.g. 10:00 AM - 04:00 PM"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Registration Deadline *</label>
                                        <input
                                            type="datetime-local"
                                            name="registrationDeadline"
                                            className="form-control"
                                            value={form.registrationDeadline}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label className="form-label">Max Seating Capacity *</label>
                                        <input
                                            type="number"
                                            name="maxCapacity"
                                            className="form-control"
                                            min="1"
                                            value={form.maxCapacity}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Cover Image URL</label>
                                        <input
                                            type="url"
                                            name="imageUrl"
                                            className="form-control"
                                            value={form.imageUrl}
                                            onChange={handleChange}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setModalOpen(false)}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving to Database...' : editingEvent ? 'Save Changes' : 'Publish Event'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
