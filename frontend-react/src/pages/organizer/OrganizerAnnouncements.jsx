import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from '../../components/Toast';

export default function OrganizerAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: '',
        content: '',
        targetDepartment: 'ALL'
    });

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            setLoading(true);
            const res = await api.announcements.getActive();
            setAnnouncements(res.data || []);
        } catch (err) {
            toast.error(err.message || 'Failed to fetch announcements');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await api.announcements.create(form);
            toast.success('Announcement broadcast published');
            setModalOpen(false);
            setForm({
                title: '',
                content: '',
                targetDepartment: 'ALL'
            });
            await loadAnnouncements();
        } catch (err) {
            toast.error(err.message || 'Failed to publish announcement');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="section-py" style={{ minHeight: '85vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Notice Board</span>
                        <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800, color: 'var(--heading-color)', letterSpacing: '-0.02em' }}>
                            Event <span style={{ color: 'var(--primary-orange)' }}>Broadcasts</span>
                        </h1>
                        <p style={{ color: 'var(--body-text)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
                            Publish live event notifications and schedule updates to registered attendees.
                        </p>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
                        + Post Update
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="spinner"></div>
                        <p style={{ color: 'var(--body-text)', marginTop: '1rem' }}>Loading bulletins...</p>
                    </div>
                ) : (
                    <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                        {announcements.map((ann) => (
                            <div key={ann.id} className="white-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <span className="badge badge-primary">{ann.targetDepartment || 'CAMPUS'}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--body-text)' }}>
                                        {ann.createdAt ? ann.createdAt.slice(0, 10) : ''}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', fontWeight: 800, color: 'var(--heading-color)' }}>{ann.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--body-text)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                    {ann.content}
                                </p>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
                                    Posted by: {ann.postedBy}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {modalOpen && (
                    <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
                        <div 
                            className="white-card" 
                            style={{ maxWidth: '540px', width: '92%', padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 0, marginBottom: '1.5rem', color: 'var(--heading-color)' }}>Post Event Update</h3>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label className="form-label">Notice Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Workshop Materials link uploaded"
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '1.75rem' }}>
                                    <label className="form-label">Message Content *</label>
                                    <textarea
                                        name="content"
                                        className="form-control"
                                        rows="4"
                                        value={form.content}
                                        onChange={handleChange}
                                        placeholder="Type update message..."
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
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
                                        {saving ? 'Posting...' : 'Post Notice'}
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
