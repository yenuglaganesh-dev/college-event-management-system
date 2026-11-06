import { useState } from 'react';
import { Api } from '../services/api';
import { showToast } from '../components/Toast';

export default function CertificateVerify() {
    const [code, setCode] = useState('');
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!code.trim()) return;

        setLoading(true);
        setCertificate(null);
        setSearched(true);

        try {
            const res = await Api.certificates.verify(code.trim());
            if (res.data) {
                setCertificate(res.data);
                showToast('Certificate verified as genuine and authentic!', 'success');
            }
        } catch (err) {
            showToast(err.message || 'Invalid certificate code', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section-container" style={{ maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <span className="brand-badge" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
                    Institutional Verification
                </span>
                <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--heading-color)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                    Verify Digital <span style={{ color: 'var(--primary-orange)' }}>Certificate</span>
                </h1>
                <p style={{ color: 'var(--body-text)', maxWidth: '520px', margin: '0.5rem auto 0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
                    Enter the unique certificate verification serial number (e.g. CERT-1-XXXXXXXX) to validate recipient authenticity.
                </p>
            </div>

            <div className="white-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <form onSubmit={handleVerify} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        className="form-control"
                        style={{ flex: 1, minWidth: '260px' }}
                        placeholder="e.g. CERT-2-D8FF58"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        required
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0.75rem 1.75rem' }}>
                        {loading ? 'Verifying...' : 'Validate Authenticity'}
                    </button>
                </form>
            </div>

            {certificate && (
                <div className="white-card" style={{ padding: '2.5rem', textAlign: 'center', borderColor: 'var(--primary-orange)', borderWidth: '2px' }}>
                    <span className="badge badge-approved" style={{ marginBottom: '1.25rem', padding: '0.4rem 1.25rem', fontSize: '0.85rem' }}>
                        ✓ Verified Authentic Institutional Certificate
                    </span>

                    <h2 style={{ color: 'var(--heading-color)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        {certificate.studentName}
                    </h2>

                    <p style={{ color: 'var(--body-text)', fontSize: '1.05rem', marginBottom: '1.25rem' }}>
                        Has successfully participated in and completed
                    </p>

                    <h3 style={{ color: 'var(--primary-orange)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.75rem' }}>
                        {certificate.eventTitle}
                    </h3>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2.5rem',
                        fontSize: '0.95rem',
                        color: 'var(--body-text)',
                        borderTop: '1px solid var(--border-color)',
                        paddingTop: '1.5rem'
                    }}>
                        <span>Serial Number: <code style={{ color: 'var(--primary-orange)', fontWeight: 700 }}>{certificate.certificateCode}</code></span>
                        <span>Date Issued: <strong style={{ color: 'var(--heading-color)' }}>{certificate.issueDate}</strong></span>
                    </div>
                </div>
            )}

            {searched && !loading && !certificate && (
                <div className="white-card" style={{ padding: '2rem', textAlign: 'center', borderColor: '#fca5a5' }}>
                    <p style={{ color: '#dc2626', margin: 0, fontWeight: 600 }}>
                        No authentic certificate found matching code &ldquo;{code}&rdquo;. Please verify the serial number.
                    </p>
                </div>
            )}
        </div>
    );
}
