import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from '../../components/Toast';

export default function AdminGallery() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: '',
        imageUrl: '',
        caption: '',
        category: 'Hackathons'
    });

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        try {
            setLoading(true);
            const res = await api.gallery.getPhotos();
            setPhotos(res.data || []);
        } catch (err) {
            toast.error(err.message || 'Failed to load gallery photos');
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
            await api.gallery.addPhoto(form);
            toast.success('Photo added to campus gallery');
            setModalOpen(false);
            setForm({
                title: '',
                imageUrl: '',
                caption: '',
                category: 'Hackathons'
            });
            await loadPhotos();
        } catch (err) {
            toast.error(err.message || 'Failed to add photo');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this photo from the campus gallery?')) return;
        try {
            await api.gallery.deletePhoto(id);
            toast.success('Photo removed');
            await loadPhotos();
        } catch (err) {
            toast.error(err.message || 'Failed to delete photo');
        }
    };

    return (
        <div className="section-py" style={{ minHeight: '85vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Visual Media</span>
                        <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800, color: 'var(--heading-color)', letterSpacing: '-0.02em' }}>
                            Campus Gallery <span style={{ color: 'var(--primary-orange)' }}>Manager</span>
                        </h1>
                        <p style={{ color: 'var(--body-text)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
                            Upload and manage photography displayed on the public event showcase.
                        </p>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
                        + Add Photo
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="spinner"></div>
                        <p style={{ color: 'var(--body-text)', marginTop: '1rem' }}>Loading photo catalog...</p>
                    </div>
                ) : (
                    <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                        {photos.map((p) => (
                            <div key={p.id} className="white-card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={p.imageUrl}
                                        alt={p.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80';
                                        }}
                                    />
                                    <span className="event-category-pill" style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', fontSize: '0.7rem' }}>
                                        {p.category}
                                    </span>
                                </div>
                                <div style={{ padding: '1.25rem' }}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: 'var(--heading-color)' }}>{p.title}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--body-text)', margin: '0 0 1rem 0' }}>{p.caption || 'No caption'}</p>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm"
                                            style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                                            onClick={() => handleDelete(p.id)}
                                        >
                                            Delete Photo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Photo Modal */}
                {modalOpen && (
                    <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
                        <div 
                            className="white-card" 
                            style={{ maxWidth: '540px', width: '92%', padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 0, marginBottom: '1.5rem', color: 'var(--heading-color)' }}>Add Gallery Photo</h3>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label className="form-label">Photo Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Hackathon Grand Finale"
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label className="form-label">Category *</label>
                                    <select
                                        name="category"
                                        className="form-select"
                                        value={form.category}
                                        onChange={handleChange}
                                    >
                                        <option value="Technical">Technical</option>
                                        <option value="Cultural">Cultural</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Conference">Conference</option>
                                        <option value="Community">Community</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label className="form-label">Image URL *</label>
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        className="form-control"
                                        value={form.imageUrl}
                                        onChange={handleChange}
                                        placeholder="https://images.unsplash.com/..."
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '1.75rem' }}>
                                    <label className="form-label">Caption / Description</label>
                                    <textarea
                                        name="caption"
                                        className="form-control"
                                        rows="2"
                                        value={form.caption}
                                        onChange={handleChange}
                                        placeholder="Optional caption..."
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
                                        {saving ? 'Adding...' : 'Add to Gallery'}
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
