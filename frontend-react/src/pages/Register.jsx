import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';

export default function Register() {
    const [formData, setFormData] = useState({
        studentId: '',
        fullName: '',
        email: '',
        phone: '',
        department: 'Computer Science & Engineering',
        yearOfStudy: '1st Year',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { registerStudent } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await registerStudent(formData);
            showToast('Student account registered successfully in MySQL!', 'success');
            navigate('/student');
        } catch (err) {
            showToast(err.message || 'Registration failed', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-transition" style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', overflow: 'hidden' }}>
            <div className="decorative-orb decorative-orb-1" />
            <div className="decorative-orb decorative-orb-2" />

            <div className="white-card responsive-card-padding" style={{ position: 'relative', zIndex: 1, maxWidth: '560px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <span className="role-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                        Student Onboarding
                    </span>
                    <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--heading-color)' }}>
                        Create Student Account
                    </h2>
                    <p style={{ color: 'var(--body-text)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                        Register for verified event participation, QR ticket passes, and certificates
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid-2col">
                        <div className="form-group">
                            <label className="form-label">Student ID *</label>
                            <input
                                type="text"
                                name="studentId"
                                className="form-control"
                                placeholder="e.g. STU-2026-042"
                                value={formData.studentId}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Full Name *</label>
                            <input
                                type="text"
                                name="fullName"
                                className="form-control"
                                placeholder="e.g. Aarav Mehta"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-grid-2col">
                        <div className="form-group">
                            <label className="form-label">College Email Address *</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="aarav@college.edu"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number *</label>
                            <input
                                type="text"
                                name="phone"
                                className="form-control"
                                placeholder="+91 98765 43210"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-grid-2col">
                        <div className="form-group">
                            <label className="form-label">Department *</label>
                            <select
                                name="department"
                                className="form-select"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                                <option value="Information Technology">Information Technology</option>
                                <option value="Electronics & Communication">Electronics & Communication</option>
                                <option value="Mechanical Engineering">Mechanical Engineering</option>
                                <option value="Civil Engineering">Civil Engineering</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Year of Study *</label>
                            <select
                                name="yearOfStudy"
                                className="form-select"
                                value={formData.yearOfStudy}
                                onChange={handleChange}
                                required
                            >
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Account Password *</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                className="form-control"
                                placeholder="Minimum 6 characters"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
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
                        {submitting ? 'Creating Account...' : 'Complete Student Registration'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--body-text)' }}>
                    Already registered? <NavLink to="/login" style={{ color: 'var(--primary-orange)', fontWeight: 600 }}>Sign In</NavLink>
                </div>
            </div>
        </div>
    );
}
