import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';

export default function AdminLogin() {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('Admin@123');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { loginAdmin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await loginAdmin(username.trim(), password);
            showToast('Administrator session established', 'success');
            navigate('/admin');
        } catch (err) {
            showToast(err.message || 'Invalid administrator credentials', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-transition" style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', overflow: 'hidden' }}>
            <div className="decorative-orb decorative-orb-1" />
            <div className="decorative-orb decorative-orb-2" />

            <div className="white-card auth-card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <span className="role-badge" style={{ marginBottom: '0.5rem', display: 'inline-block', background: '#FEF2F2', color: '#DC2626', borderColor: '#FECACA' }}>
                        Restricted Control Plane
                    </span>
                    <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--heading-color)' }}>
                        System Admin Portal
                    </h2>
                    <p style={{ color: 'var(--body-text)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                        Administrative controls for event approvals and institutional telemetry
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Administrator Username</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="admin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Admin Security Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block btn-pill"
                        style={{ padding: '0.8rem', marginTop: '0.5rem' }}
                        disabled={submitting}
                    >
                        {submitting ? 'Authenticating Admin...' : 'Authenticate Admin Session'}
                    </button>
                </form>

                <div style={{
                    marginTop: '1.75rem',
                    padding: '0.85rem',
                    background: 'var(--light-orange-subtle)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem',
                    color: 'var(--body-text)',
                    textAlign: 'center'
                }}>
                    Default Credentials: <code>admin</code> / <code>Admin@123</code>
                </div>
            </div>
        </div>
    );
}
