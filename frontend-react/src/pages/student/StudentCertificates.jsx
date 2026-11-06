import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from '../../components/Toast';

export default function StudentCertificates() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeModalCert, setActiveModalCert] = useState(null);

    useEffect(() => {
        loadCertificates();
    }, []);

    const loadCertificates = async () => {
        try {
            setLoading(true);
            const res = await api.certificates.getMyCertificates();
            setCertificates(res.data || []);
        } catch (err) {
            toast.error(err.message || 'Failed to load certificates');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="section-py" style={{ minHeight: '80vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Accreditation</span>
                        <h1 style={{ fontSize: '2.25rem', margin: 0, fontWeight: 800, color: 'var(--heading-color)' }}>My Digital Certificates</h1>
                        <p style={{ color: 'var(--body-text)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
                            Official verifiable credentials earned from completed college events.
                        </p>
                    </div>
                    <Link to="/verify-certificate" className="btn btn-secondary">
                        Open Public Verifier &rarr;
                    </Link>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="spinner"></div>
                        <p style={{ color: 'var(--body-text)', marginTop: '1rem' }}>Loading credentials...</p>
                    </div>
                ) : certificates.length === 0 ? (
                    <div className="white-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--light-orange)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-orange)" strokeWidth="2">
                                <path d="M12 15l-4 6 4-2 4 2-4-6z"/>
                                <circle cx="12" cy="9" r="6"/>
                            </svg>
                        </div>
                        <h3 style={{ fontSize: '1.35rem', color: 'var(--heading-color)', marginBottom: '0.5rem', fontWeight: 800 }}>No Certificates Issued Yet</h3>
                        <p style={{ color: 'var(--body-text)', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
                            Certificates are awarded by administrators and event organizers after event completion and verified attendance.
                        </p>
                        <Link to="/events" className="btn btn-primary">Browse Upcoming Events</Link>
                    </div>
                ) : (
                    <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                        {certificates.map((cert) => (
                            <div key={cert.id} className="white-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <span className="badge badge-approved">Verified Genuine</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--body-text)' }}>{cert.issueDate}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 800, color: 'var(--heading-color)' }}>{cert.eventTitle}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--body-text)', marginBottom: '1rem' }}>
                                        Issued to: <strong style={{ color: 'var(--heading-color)' }}>{cert.studentName}</strong>
                                    </p>
                                    <div style={{ background: 'var(--light-orange-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)', marginBottom: '1.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--body-text)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Verification Code</span>
                                        <code style={{ fontSize: '0.95rem', color: 'var(--primary-orange)', fontWeight: 800 }}>{cert.certificateCode}</code>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button 
                                        type="button" 
                                        className="btn btn-primary" 
                                        style={{ flex: 1, padding: '0.6rem' }}
                                        onClick={() => setActiveModalCert(cert)}
                                    >
                                        View Certificate
                                    </button>
                                    <Link 
                                        to={`/verify-certificate?code=${cert.certificateCode}`} 
                                        className="btn btn-secondary"
                                        style={{ padding: '0.6rem 1rem' }}
                                        title="Verify online"
                                    >
                                        Verify
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Certificate Display Modal */}
                {activeModalCert && (
                    <div className="modal-backdrop" onClick={() => setActiveModalCert(null)}>
                        <div 
                            className="white-card" 
                            style={{ maxWidth: '760px', width: '92%', padding: '2.5rem', position: 'relative', boxShadow: 'var(--shadow-lg)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                type="button" 
                                onClick={() => setActiveModalCert(null)}
                                style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'transparent', border: 'none', color: 'var(--body-text)', cursor: 'pointer', fontSize: '1.75rem', lineHeight: 1 }}
                            >
                                &times;
                            </button>

                            {/* Printable Certificate Frame (Ivory Parchment with Orange Accents) */}
                            <div style={{
                                border: '4px double var(--primary-orange)',
                                padding: '3rem 2.5rem',
                                textAlign: 'center',
                                borderRadius: 'var(--radius-lg)',
                                background: '#FFFDF9',
                                boxShadow: 'inset 0 0 40px rgba(240, 120, 36, 0.05)'
                            }}>
                                <div style={{ letterSpacing: '0.25em', textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--primary-orange)', fontWeight: 800, marginBottom: '0.75rem' }}>
                                    Apex Institute of Technology
                                </div>
                                <h2 style={{ fontSize: '2.25rem', fontWeight: 900, margin: '0 0 0.5rem 0', color: 'var(--heading-color)', letterSpacing: '-0.02em' }}>
                                    Certificate of Participation
                                </h2>
                                <p style={{ fontSize: '0.95rem', color: 'var(--body-text)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                                    This official credential certifies that
                                </p>
                                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-orange)', padding: '0.5rem 0', borderBottom: '2px solid var(--border-color)', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
                                    {activeModalCert.studentName}
                                </div>
                                <p style={{ fontSize: '0.95rem', color: 'var(--body-text)', maxWidth: '520px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
                                    has actively participated in and successfully fulfilled all curricular requirements for the collegiate event:
                                </p>
                                <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--heading-color)', marginBottom: '2rem' }}>
                                    {activeModalCert.eventTitle}
                                </h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2.5rem', paddingTop: '1.75rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Date of Issue</div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--heading-color)' }}>{activeModalCert.issueDate}</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--primary-orange)', fontWeight: 800 }}>
                                            {activeModalCert.certificateCode}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cryptographic Verification Key</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--heading-color)', fontWeight: 600 }}>Dean of Academic Affairs</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Official Institutional Seal</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
                                <button type="button" onClick={handlePrint} className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
                                    Print / Save as PDF
                                </button>
                                <button type="button" onClick={() => setActiveModalCert(null)} className="btn btn-secondary">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
