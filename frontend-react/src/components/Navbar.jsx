import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from './Toast';
import centurionLogo from '../assets/centurion-logo.png';

export default function Navbar() {
    const { user, isAuthenticated, isAdmin, isOrganizer, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        showToast('Signed out successfully', 'info');
        setMobileMenuOpen(false);
        navigate('/');
    };

    const closeMobile = () => setMobileMenuOpen(false);

    return (
        <header className="nav-sticky-wrapper">
            <nav className="nav-container-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <NavLink to="/" className="nav-brand" onClick={closeMobile}>
                        <img
                            src={centurionLogo}
                            alt="Centurion University Logo"
                            className="nav-university-logo"
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <span>College<span className="nav-brand-orange">Events</span></span>
                            {isAdmin && (
                                <span className="role-badge" style={{ background: '#FEF2F2', color: '#DC2626', borderColor: '#FECACA' }}>Admin</span>
                            )}
                            {isOrganizer && (
                                <span className="role-badge" style={{ background: 'var(--light-orange)', color: 'var(--primary-orange)' }}>Organizer</span>
                            )}
                            {!isAdmin && !isOrganizer && (
                                <span className="role-badge">Campus</span>
                            )}
                        </div>
                    </NavLink>
                </div>

                {/* Desktop Navigation Tabs */}
                <ul className="nav-tab-list" style={{ display: 'flex' }}>
                    {/* Public Tabs */}
                    {!isAuthenticated && (
                        <>
                            <li className="nav-tab-item"><NavLink to="/" end>Home</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/events">Events</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/gallery">Gallery</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/verify-certificate">Verify</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/about">About</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/contact">Contact</NavLink></li>
                        </>
                    )}

                    {/* Student Tabs */}
                    {isAuthenticated && !isAdmin && !isOrganizer && (
                        <>
                            <li className="nav-tab-item"><NavLink to="/student" end>Dashboard</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/events">Explore</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/student/registrations">My Registrations</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/student/calendar">Calendar</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/student/certificates">Certificates</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/student/profile">Profile</NavLink></li>
                        </>
                    )}

                    {/* Admin Tabs */}
                    {isAdmin && (
                        <>
                            <li className="nav-tab-item"><NavLink to="/admin" end>Dashboard</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/admin/registrations">Registrations</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/admin/events">Events</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/admin/students">Students</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/admin/attendance">Attendance</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/admin/certificates">Certificates</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/admin/reports">Reports</NavLink></li>
                        </>
                    )}

                    {/* Organizer Tabs */}
                    {isOrganizer && (
                        <>
                            <li className="nav-tab-item"><NavLink to="/organizer" end>Dashboard</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/organizer/events">My Events</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/organizer/attendance">QR Check-in</NavLink></li>
                            <li className="nav-tab-item"><NavLink to="/organizer/announcements">Announcements</NavLink></li>
                        </>
                    )}
                </ul>

                {/* Right Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {isAuthenticated ? (
                        <div className="nav-user-desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading-color)' }}>
                                {user?.fullName?.split(' ')[0] || user?.username}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="btn btn-secondary btn-sm btn-pill"
                                style={{ color: '#DC2626' }}
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="nav-auth-desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <NavLink to="/login" className="btn btn-secondary btn-sm btn-pill">
                                Student Sign In
                            </NavLink>
                            <NavLink to="/register" className="btn btn-primary btn-sm btn-pill">
                                Register
                            </NavLink>
                        </div>
                    )}

                    {/* Mobile Hamburger Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle Navigation"
                        style={{
                            display: 'none',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-pill)',
                            color: 'var(--heading-color)',
                            minWidth: '40px',
                            minHeight: '40px'
                        }}
                        className="mobile-hamburger-btn"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            {mobileMenuOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" />
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            )}
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="mobile-nav-drawer" style={{
                    position: 'absolute',
                    top: '100%',
                    left: '1rem',
                    right: '1rem',
                    marginTop: '0.5rem',
                    background: '#FFFFFF',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '1.25rem',
                    zIndex: 999,
                    animation: 'fadeSlideUp 0.25s ease'
                }}>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {!isAuthenticated && (
                            <>
                                <li><NavLink to="/" onClick={closeMobile} className="mobile-nav-link">Home</NavLink></li>
                                <li><NavLink to="/events" onClick={closeMobile} className="mobile-nav-link">Events</NavLink></li>
                                <li><NavLink to="/gallery" onClick={closeMobile} className="mobile-nav-link">Gallery</NavLink></li>
                                <li><NavLink to="/verify-certificate" onClick={closeMobile} className="mobile-nav-link">Verify Credentials</NavLink></li>
                                <li><NavLink to="/about" onClick={closeMobile} className="mobile-nav-link">About</NavLink></li>
                                <li><NavLink to="/contact" onClick={closeMobile} className="mobile-nav-link">Contact</NavLink></li>
                                <li style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', marginTop: '0.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                    <NavLink to="/login" onClick={closeMobile} className="btn btn-secondary btn-sm btn-pill" style={{ textAlign: 'center' }}>
                                        Sign In
                                    </NavLink>
                                    <NavLink to="/register" onClick={closeMobile} className="btn btn-primary btn-sm btn-pill" style={{ textAlign: 'center' }}>
                                        Register
                                    </NavLink>
                                </li>
                            </>
                        )}
                        {isAuthenticated && (
                            <>
                                <li style={{ padding: '0.5rem 0.75rem', background: 'var(--light-orange-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, color: 'var(--heading-color)', fontSize: '0.95rem' }}>{user?.fullName || user?.username}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--primary-orange)', fontWeight: 600 }}>{user?.role?.replace('ROLE_', '')}</div>
                                    </div>
                                    <span className="role-badge">{isAdmin ? 'Admin' : isOrganizer ? 'Organizer' : 'Student'}</span>
                                </li>
                                {isAdmin && (
                                    <>
                                        <li><NavLink to="/admin" onClick={closeMobile} className="mobile-nav-link">Admin Dashboard</NavLink></li>
                                        <li><NavLink to="/admin/registrations" onClick={closeMobile} className="mobile-nav-link">Registrations Queue</NavLink></li>
                                        <li><NavLink to="/admin/events" onClick={closeMobile} className="mobile-nav-link">Events Catalog</NavLink></li>
                                        <li><NavLink to="/admin/students" onClick={closeMobile} className="mobile-nav-link">Students Directory</NavLink></li>
                                        <li><NavLink to="/admin/attendance" onClick={closeMobile} className="mobile-nav-link">Attendance</NavLink></li>
                                        <li><NavLink to="/admin/reports" onClick={closeMobile} className="mobile-nav-link">Reports</NavLink></li>
                                    </>
                                )}
                                {isOrganizer && (
                                    <>
                                        <li><NavLink to="/organizer" onClick={closeMobile} className="mobile-nav-link">Organizer Dashboard</NavLink></li>
                                        <li><NavLink to="/organizer/events" onClick={closeMobile} className="mobile-nav-link">My Events</NavLink></li>
                                        <li><NavLink to="/organizer/attendance" onClick={closeMobile} className="mobile-nav-link">QR Check-in</NavLink></li>
                                        <li><NavLink to="/organizer/announcements" onClick={closeMobile} className="mobile-nav-link">Announcements</NavLink></li>
                                    </>
                                )}
                                {!isAdmin && !isOrganizer && (
                                    <>
                                        <li><NavLink to="/student" onClick={closeMobile} className="mobile-nav-link">Student Dashboard</NavLink></li>
                                        <li><NavLink to="/events" onClick={closeMobile} className="mobile-nav-link">Explore Events</NavLink></li>
                                        <li><NavLink to="/student/registrations" onClick={closeMobile} className="mobile-nav-link">My Registrations</NavLink></li>
                                        <li><NavLink to="/student/calendar" onClick={closeMobile} className="mobile-nav-link">Calendar</NavLink></li>
                                        <li><NavLink to="/student/certificates" onClick={closeMobile} className="mobile-nav-link">Certificates</NavLink></li>
                                        <li><NavLink to="/student/profile" onClick={closeMobile} className="mobile-nav-link">Profile</NavLink></li>
                                    </>
                                )}
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-secondary btn-block"
                                        style={{ color: '#DC2626', marginTop: '0.5rem' }}
                                    >
                                        Sign Out
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </header>
    );
}
