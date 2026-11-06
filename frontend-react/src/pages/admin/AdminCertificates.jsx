import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from '../../components/Toast';

export default function AdminCertificates() {
    const [certificates, setCertificates] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRegId, setSelectedRegId] = useState('');
    const [issuing, setIssuing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [certRes, regRes] = await Promise.all([
                api.certificates.getAll(),
                api.registrations.getAllForAdmin()
            ]);
            setCertificates(certRes.data || []);
            // Filter registrations that are approved and don't yet have certificates
            const approved = (regRes.data || []).filter(r => r.status === 'APPROVED');
            setRegistrations(approved);
            if (approved.length > 0) {
                setSelectedRegId(String(approved[0].id));
            }
        } catch (err) {
            toast.error(err.message || 'Failed to load credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleIssueCertificate = async (e) => {
        e.preventDefault();
        if (!selectedRegId) {
            toast.error('Please select an approved attendee');
            return;
        }

        try {
            setIssuing(true);
            const res = await api.certificates.issue(Number(selectedRegId));
            toast.success(res.message || 'Digital certificate issued successfully');
            setModalOpen(false);
            await loadData();
        } catch (err) {
            toast.error(err.message || 'Failed to issue certificate');
        } finally {
            setIssuing(false);
        }
    };

    return (
        <div className="section-py" style={{ minHeight: '85vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Accreditation</span>
                        <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800, color: 'var(--heading-color)', letterSpacing: '-0.02em' }}>
                            Certificates <span style={{ color: 'var(--primary-orange)' }}>Management</span>
                        </h1>
                        <p style={{ color: 'var(--body-text)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
                            Issue and audit cryptographic digital certificates of participation.
                        </p>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
                        + Issue New Certificate
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="spinner"></div>
                        <p style={{ color: 'var(--body-text)', marginTop: '1rem' }}>Loading credentials registry...</p>
                    </div>
                ) : certificates.length === 0 ? (
                    <div className="white-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--body-text)', fontSize: '1.05rem', marginBottom: '1.25rem' }}>No certificates issued yet.</p>
                        <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
                            Issue First Certificate
                        </button>
                    </div>
                ) : (
                    <div className="white-card" style={{ padding: '2rem' }}>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Certificate Code</th>
                                        <th>Recipient Student</th>
                                        <th>Event Title</th>
                                        <th>Date Issued</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {certificates.map((c) => (
                                        <tr key={c.id}>
                                            <td>
                                                <code style={{ color: 'var(--primary-orange)', fontWeight: 700, fontSize: '0.85rem' }}>{c.certificateCode}</code>
                                            </td>
                                            <td style={{ fontWeight: 700, color: 'var(--heading-color)' }}>
                                                {c.studentName}
                                            </td>
                                            <td style={{ color: 'var(--heading-color)', fontWeight: 600 }}>{c.eventTitle}</td>
                                            <td style={{ fontSize: '0.85rem', color: 'var(--body-text)' }}>
                                                {c.issueDate}
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <Link 
                                                    to={`/verify-certificate?code=${c.certificateCode}`} 
                                                    className="btn btn-secondary btn-sm"
                                                    style={{ padding: '0.35rem 0.85rem' }}
                                                >
                                                    Verify Online &rarr;
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Issue Modal */}
                {modalOpen && (
                    <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
                        <div 
                            className="white-card" 
                            style={{ maxWidth: '560px', width: '92%', padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 0, marginBottom: '1.5rem', color: 'var(--heading-color)' }}>
                                Issue Digital Certificate
                            </h3>

                            {registrations.length === 0 ? (
                                <p style={{ color: 'var(--body-text)' }}>
                                    There are currently no approved attendees eligible for certificate issuance.
                                </p>
                            ) : (
                                <form onSubmit={handleIssueCertificate}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label className="form-label">Select Approved Attendee Application *</label>
                                        <select
                                            className="form-select"
                                            value={selectedRegId}
                                            onChange={(e) => setSelectedRegId(e.target.value)}
                                            required
                                        >
                                            {registrations.map(r => (
                                                <option key={r.id} value={r.id}>
                                                    {r.studentName} ({r.studentId}) &mdash; {r.eventTitle}
                                                </option>
                                            ))}
                                        </select>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            Only attendees with APPROVED registration status are eligible.
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setModalOpen(false)}
                                            disabled={issuing}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={issuing}
                                        >
                                            {issuing ? 'Generating Credential...' : 'Issue Certificate'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
