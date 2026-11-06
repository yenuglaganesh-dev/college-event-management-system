import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';

export default function Login() {
    const [identifier, setIdentifier] = useState('STU-2026-001');
    const [password, setPassword] = useState('Student@123');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { loginStudent } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/student';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await loginStudent(identifier.trim(), password);
            showToast('Student authenticated successfully', 'success');
            navigate(from, { replace: true });
        } catch (err) {
            showToast(err.message || 'Invalid credentials', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-transition" style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', overflow: 'hidden' }}>
            <div className="decorative-orb decorative-orb-1" />
            <div className="decorative-orb decorative-orb-2" />

            <div className="white-card" style={{ position: 'relative', zIndex: 1, maxWidth: '440px', width: '100%', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <span className="role-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                        Student Authentication
                    </span>
                    <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--heading-color)' }}>
                        Student Portal Login
                    </h2>
                    <p style={{ color: 'var(--body-text)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                        Sign in using your Student ID or verified college email
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Student ID or College Email</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. STU-2026-001"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Account Password</label>
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
                        {submitting ? 'Authenticating...' : 'Sign In to Portal'}
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
                    Default Demo: <code>STU-2026-001</code> / <code>Student@123</code>
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--body-text)' }}>
                    Don&apos;t have an account? <NavLink to="/register" style={{ color: 'var(--primary-orange)', fontWeight: 600 }}>Register Now</NavLink>
                </div>
            </div>
        </div>
    );
}
