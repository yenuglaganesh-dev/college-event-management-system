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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                            padding: '0.4rem',
                            color: 'var(--heading-color)'
                        }}
                        className="mobile-hamburger-btn"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '1.25rem',
                    right: '1.25rem',
                    marginTop: '0.5rem',
                    background: '#FFFFFF',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '1.25rem',
                    zIndex: 999,
                    animation: 'fadeSlideUp 0.25s ease'
                }}>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {!isAuthenticated && (
                            <>
                                <li><NavLink to="/" onClick={closeMobile} style={{ display: 'block', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Home</NavLink></li>
                                <li><NavLink to="/events" onClick={closeMobile} style={{ display: 'block', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Events</NavLink></li>
                                <li><NavLink to="/gallery" onClick={closeMobile} style={{ display: 'block', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Gallery</NavLink></li>
                                <li><NavLink to="/verify-certificate" onClick={closeMobile} style={{ display: 'block', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Verify Credentials</NavLink></li>
                                <li><NavLink to="/about" onClick={closeMobile} style={{ display: 'block', padding: '0.5rem 0.75rem', fontWeight: 600 }}>About</NavLink></li>
                                <li><NavLink to="/contact" onClick={closeMobile} style={{ display: 'block', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Contact</NavLink></li>
                            </>
                        )}
                        {isAuthenticated && (
                            <>
                                {isAdmin && (
                                    <>
                                        <li><NavLink to="/admin" onClick={closeMobile} style={{ display: 'block', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Admin Dashboard</NavLink></li>
                                        <li><NavLink to="/admin/registrations" onClick={closeMobile} style={{ display: 'block', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Registrations Queue</NavLink></li>
                                        <li><NavLink to="/admin/events" onClick={closeMobile} style={{ display: 'block', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Events Catalog</NavLink></li>
                                    </>
                                )}
                                {!isAdmin && !isOrganizer && (
                                    <>
                                        <li><NavLink to="/student" onClick={closeMobile} style={{ display: 'block', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Student Dashboard</NavLink></li>
                                        <li><NavLink to="/events" onClick={closeMobile} style={{ display: 'block', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Explore Events</NavLink></li>
                                        <li><NavLink to="/student/registrations" onClick={closeMobile} style={{ display: 'block', padding: '0.5rem 0.75rem', fontWeight: 600 }}>My Registrations</NavLink></li>
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
