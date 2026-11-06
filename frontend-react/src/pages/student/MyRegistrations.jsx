import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';

export default function MyRegistrations() {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTicket, setActiveTicket] = useState(null);

    const loadRegistrations = async () => {
        try {
            const res = await Api.registrations.getMyRegistrations();
            if (res.data) setRegistrations(res.data);
            setLoading(false);
        } catch (err) {
            showToast('Could not load registrations: ' + err.message, 'error');
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRegistrations();
        const interval = setInterval(loadRegistrations, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleCancel = async (id, title) => {
        if (!window.confirm(`Are you sure you want to cancel your registration for "${title}"?`)) {
            return;
        }

        try {
            await Api.registrations.cancel(id);
            showToast('Registration cancelled successfully', 'info');
            loadRegistrations();
        } catch (err) {
            showToast(err.message || 'Cancellation failed', 'error');
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Student Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-user">
                    <div className="sidebar-user-name">{user?.fullName || 'Student'}</div>
                    <div className="sidebar-user-role">ID: {user?.studentId || 'Enrolled Student'}</div>
                </div>
                <ul className="sidebar-nav">
                    <li><NavLink to="/student" end className={({ isActive }) => isActive ? 'active' : ''}>Dashboard Overview</NavLink></li>
                    <li><NavLink to="/student/registrations" className={({ isActive }) => isActive ? 'active' : ''}>My Registrations</NavLink></li>
                    <li><NavLink to="/student/calendar" className={({ isActive }) => isActive ? 'active' : ''}>Event Calendar</NavLink></li>
                    <li><NavLink to="/student/certificates" className={({ isActive }) => isActive ? 'active' : ''}>My Certificates</NavLink></li>
                    <li><NavLink to="/student/profile" className={({ isActive }) => isActive ? 'active' : ''}>Student Profile</NavLink></li>
                    <li><NavLink to="/events">Explore Events</NavLink></li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div>
                        <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Student Passports</span>
                        <h1>My Event Registrations</h1>
                        <p>Track your real-time approval status, download QR entrance passes, and view faculty remarks.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={loadRegistrations} className="btn btn-secondary btn-sm">
                            Refresh Status
                        </button>
                        <NavLink to="/events" className="btn btn-primary btn-sm">
                            + Register for Event
                        </NavLink>
                    </div>
                </div>

                <div className="white-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Ticket Code</th>
                                    <th>Event Title</th>
                                    <th>Event Date & Time</th>
                                    <th>Venue</th>
                                    <th>Status</th>
                                    <th>Admin Remarks</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--body-text)' }}>Loading registrations from MySQL database...</td></tr>
                                ) : registrations.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--body-text)' }}>
                                            No event registrations recorded yet. Browse the <NavLink to="/events" style={{ color: 'var(--primary-orange)', fontWeight: 600 }}>events directory</NavLink> to sign up!
                                        </td>
                                    </tr>
                                ) : (
                                    registrations.map((r) => {
                                        let badgeClass = 'badge-pending';
                                        if (r.status === 'APPROVED') badgeClass = 'badge-approved';
                                        else if (r.status === 'REJECTED') badgeClass = 'badge-rejected';
                                        else if (r.status === 'CANCELLED') badgeClass = 'badge-rejected';

                                        return (
                                            <tr key={r.id}>
                                                <td><code style={{ color: 'var(--primary-orange)', fontWeight: 700 }}>{r.registrationCode}</code></td>
                                                <td><strong style={{ color: 'var(--heading-color)' }}>{r.eventTitle}</strong></td>
                                                <td>
                                                    <div style={{ color: 'var(--heading-color)', fontWeight: 600 }}>{r.eventDate}</div>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--body-text)' }}>{r.eventTime}</span>
                                                </td>
                                                <td>{r.eventVenue}</td>
                                                <td><span className={`badge ${badgeClass}`}>{r.status}</span></td>
                                                <td style={{ fontSize: '0.85rem', color: 'var(--body-text)' }}>
                                                    {r.adminRemarks || (r.status === 'PENDING' ? 'Under committee review' : 'N/A')}
                                                </td>
                                                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                    {r.status === 'APPROVED' && (
                                                        <button
                                                            onClick={() => setActiveTicket(r)}
                                                            className="btn btn-primary btn-sm"
                                                            style={{ marginRight: '0.5rem', padding: '0.35rem 0.8rem' }}
                                                        >
                                                            QR Ticket
                                                        </button>
                                                    )}
                                                    {r.status !== 'CANCELLED' && r.status !== 'REJECTED' && (
                                                        <button
                                                            onClick={() => handleCancel(r.id, r.eventTitle)}
                                                            className="btn btn-secondary btn-sm"
                                                            style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* QR Code Ticket Modal */}
                {activeTicket && (
                    <div className="modal-backdrop" onClick={() => setActiveTicket(null)}>
                        <div className="white-card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }} onClick={(e) => e.stopPropagation()}>
                            <span className="badge badge-approved" style={{ marginBottom: '1.25rem', padding: '0.35rem 1rem' }}>
                                ✓ Confirmed Entrance Pass
                            </span>

                            <h3 style={{ color: 'var(--heading-color)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                                {activeTicket.eventTitle}
                            </h3>
                            <p style={{ color: 'var(--body-text)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                {activeTicket.eventVenue} &bull; {activeTicket.eventDate}
                            </p>

                            {/* QR Code Container */}
                            <div style={{
                                background: '#FFFFFF',
                                padding: '1.25rem',
                                borderRadius: 'var(--radius-lg)',
                                display: 'inline-block',
                                marginBottom: '1.5rem',
                                border: '2px solid var(--border-color)',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <QRCodeSVG
                                    value={activeTicket.registrationCode}
                                    size={180}
                                    level="H"
                                    fgColor="#242424"
                                />
                            </div>

                            <div style={{ fontSize: '0.9rem', color: 'var(--body-text)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                                <div>Attendee: <strong style={{ color: 'var(--heading-color)' }}>{activeTicket.studentName}</strong></div>
                                <div>Student ID: <code style={{ color: 'var(--primary-orange)', fontWeight: 700 }}>{activeTicket.studentCode}</code></div>
                                <div>Ticket Code: <code style={{ color: 'var(--primary-orange)', fontWeight: 700 }}>{activeTicket.registrationCode}</code></div>
                            </div>

                            <button
                                onClick={() => setActiveTicket(null)}
                                className="btn btn-secondary"
                                style={{ width: '100%', padding: '0.75rem' }}
                            >
                                Close Ticket Pass
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
