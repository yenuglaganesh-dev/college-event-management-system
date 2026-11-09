import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';

export default function OrganizerLogin() {
    const [username, setUsername] = useState('organizer');
    const [password, setPassword] = useState('Admin@123');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { loginOrganizer } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await loginOrganizer(username.trim(), password);
            showToast('Organizer session authenticated', 'success');
            navigate('/organizer');
        } catch (err) {
            showToast(err.message || 'Invalid organizer credentials', 'error');
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
                    <span className="role-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                        Faculty Operations
                    </span>
                    <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--heading-color)' }}>
                        Faculty Organizer Login
                    </h2>
                    <p style={{ color: 'var(--body-text)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                        Event oversight, QR gate check-ins, and participant rosters
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Organizer Account Username</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="organizer"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Access Password</label>
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
                        {submitting ? 'Authenticating...' : 'Sign In as Organizer'}
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
                    Default Credentials: <code>organizer</code> / <code>Admin@123</code>
                </div>
            </div>
        </div>
    );
}
