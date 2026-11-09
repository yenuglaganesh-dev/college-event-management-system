import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from '../../components/Toast';

export default function AdminOrganizers() {
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        fullName: '',
        username: '',
        email: '',
        phone: '',
        department: 'Computer Science',
        password: 'Admin@123'
    });

    useEffect(() => {
        loadOrganizers();
    }, []);

    const loadOrganizers = async () => {
        try {
            setLoading(true);
            const res = await api.organizers.getAll();
            setOrganizers(res.data || []);
        } catch (err) {
            toast.error(err.message || 'Failed to fetch organizers');
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
            await api.organizers.create(form);
            toast.success(`Organizer account "${form.username}" created successfully`);
            setModalOpen(false);
            setForm({
                fullName: '',
                username: '',
                email: '',
                phone: '',
                department: 'Computer Science',
                password: 'Admin@123'
            });
            await loadOrganizers();
        } catch (err) {
            toast.error(err.message || 'Failed to create organizer');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="section-py" style={{ minHeight: '85vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Staff & Faculty</span>
                        <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800, color: 'var(--heading-color)', letterSpacing: '-0.02em' }}>
                            Faculty <span style={{ color: 'var(--primary-orange)' }}>Organizers</span>
                        </h1>
                        <p style={{ color: 'var(--body-text)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
                            Grant event coordination privileges, attendance scanning, and certificate awards to staff coordinators.
                        </p>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
                        + Add Faculty Organizer
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="spinner"></div>
                        <p style={{ color: 'var(--body-text)', marginTop: '1rem' }}>Loading organizers...</p>
                    </div>
                ) : organizers.length === 0 ? (
                    <div className="white-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--body-text)', fontSize: '1.05rem', marginBottom: '1.25rem' }}>No faculty organizers registered yet.</p>
                        <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
                            Register Organizer
                        </button>
                    </div>
                ) : (
                    <div className="white-card" style={{ padding: '2rem' }}>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Department</th>
                                        <th>Role Authority</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {organizers.map((org) => (
                                        <tr key={org.id}>
                                            <td style={{ fontWeight: 700, color: 'var(--heading-color)' }}>
                                                {org.fullName}
                                            </td>
                                            <td>
                                                <code style={{ color: 'var(--primary-orange)', fontWeight: 700, fontSize: '0.85rem' }}>{org.username}</code>
                                            </td>
                                            <td style={{ fontSize: '0.9rem', color: 'var(--body-text)' }}>
                                                {org.email}
                                            </td>
                                            <td style={{ fontSize: '0.9rem', color: 'var(--body-text)' }}>
                                                {org.phone || 'N/A'}
                                            </td>
                                            <td>
                                                <span className="badge badge-primary">
                                                    {org.department}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge badge-approved">ORGANIZER</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Add Organizer Modal */}
                {modalOpen && (
                    <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
                        <div 
                            className="white-card responsive-modal-card" 
                            style={{ maxWidth: '560px', boxShadow: 'var(--shadow-lg)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 0, marginBottom: '1.5rem', color: 'var(--heading-color)' }}>
                                Register Faculty Organizer
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label className="form-label">Full Name *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        className="form-control"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        placeholder="e.g. Dr. Robert Vance"
                                        required
                                    />
                                </div>
                                <div className="form-grid-2col" style={{ marginBottom: '1.25rem' }}>
                                    <div>
                                        <label className="form-label">Login Username *</label>
                                        <input
                                            type="text"
                                            name="username"
                                            className="form-control"
                                            value={form.username}
                                            onChange={handleChange}
                                            placeholder="e.g. rvance"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Temporary Password *</label>
                                        <input
                                            type="text"
                                            name="password"
                                            className="form-control"
                                            value={form.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-grid-2col" style={{ marginBottom: '1.25rem' }}>
                                    <div>
                                        <label className="form-label">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-control"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="+1 555-0199"
                                        />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '1.75rem' }}>
                                    <label className="form-label">Academic Department</label>
                                    <select
                                        name="department"
                                        className="form-select"
                                        value={form.department}
                                        onChange={handleChange}
                                    >
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="Electronics & Communication">Electronics & Communication</option>
                                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                                        <option value="Civil Engineering">Civil Engineering</option>
                                        <option value="Biotechnology">Biotechnology</option>
                                        <option value="Management Studies">Management Studies</option>
                                    </select>
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
                                        {saving ? 'Creating Account...' : 'Register Organizer'}
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
