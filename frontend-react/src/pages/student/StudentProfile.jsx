import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';

export default function StudentProfile() {
    const { user, login } = useAuth();
    const [profile, setProfile] = useState({
        rollNumber: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        department: '',
        yearOfStudy: '',
        gender: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const res = await api.students.getProfile();
            if (res.data) {
                setProfile({
                    rollNumber: res.data.rollNumber || '',
                    fullName: res.data.fullName || '',
                    email: res.data.email || '',
                    phoneNumber: res.data.phoneNumber || '',
                    department: res.data.department || 'Computer Science',
                    yearOfStudy: res.data.yearOfStudy ? String(res.data.yearOfStudy) : '1',
                    gender: res.data.gender || 'Prefer not to say'
                });
            }
        } catch (err) {
            toast.error(err.message || 'Failed to load profile details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const res = await api.students.updateProfile(profile);
            toast.success('Profile updated successfully');
            if (user && res.data) {
                const storedUser = api.getUser() || {};
                storedUser.fullName = res.data.fullName;
                api.setUser(storedUser);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="section-py" style={{ minHeight: '80vh' }}>
            <div className="container" style={{ maxWidth: '760px' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Student Account</span>
                    <h1 style={{ fontSize: '2.25rem', margin: 0, fontWeight: 800, color: 'var(--heading-color)' }}>Student Profile</h1>
                    <p style={{ color: 'var(--body-text)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
                        Manage your collegiate credentials, contact details, and department affiliation.
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="spinner"></div>
                        <p style={{ color: 'var(--body-text)', marginTop: '1rem' }}>Loading profile...</p>
                    </div>
                ) : (
                    <div className="white-card responsive-card-padding">
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid-2col" style={{ marginBottom: '1.5rem' }}>
                                <div>
                                    <label className="form-label">Roll Number</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={profile.rollNumber} 
                                        disabled 
                                        style={{ background: '#F9FAFB', cursor: 'not-allowed', color: 'var(--text-muted)' }}
                                    />
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Institutional identifier cannot be modified</span>
                                </div>
                                <div>
                                    <label className="form-label">Full Legal Name *</label>
                                    <input 
                                        type="text" 
                                        name="fullName"
                                        className="form-control" 
                                        value={profile.fullName} 
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="form-grid-2col" style={{ marginBottom: '1.5rem' }}>
                                <div>
                                    <label className="form-label">Email Address *</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        className="form-control" 
                                        value={profile.email} 
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Phone Number *</label>
                                    <input 
                                        type="tel" 
                                        name="phoneNumber"
                                        className="form-control" 
                                        value={profile.phoneNumber} 
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="form-grid-2col" style={{ marginBottom: '1.5rem' }}>
                                <div>
                                    <label className="form-label">Department *</label>
                                    <select 
                                        name="department" 
                                        className="form-select"
                                        value={profile.department}
                                        onChange={handleChange}
                                        required
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
                                <div>
                                    <label className="form-label">Year of Study *</label>
                                    <select 
                                        name="yearOfStudy" 
                                        className="form-select"
                                        value={profile.yearOfStudy}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="1">1st Year (Freshman)</option>
                                        <option value="2">2nd Year (Sophomore)</option>
                                        <option value="3">3rd Year (Junior)</option>
                                        <option value="4">4th Year (Senior)</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label className="form-label">Gender</label>
                                <select 
                                    name="gender" 
                                    className="form-select"
                                    value={profile.gender}
                                    onChange={handleChange}
                                >
                                    <option value="Prefer not to say">Prefer not to say</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Non-binary">Non-binary</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.75rem' }}>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary" 
                                    disabled={saving}
                                    style={{ minWidth: '180px', padding: '0.75rem 1.5rem' }}
                                >
                                    {saving ? 'Saving Changes...' : 'Save Profile Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
