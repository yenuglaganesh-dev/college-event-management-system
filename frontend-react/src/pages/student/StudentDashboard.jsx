import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            Api.registrations.getMyRegistrations().catch(() => ({ data: [] })),
            Api.certificates.getMyCertificates().catch(() => ({ data: [] })),
            Api.announcements.getActive().catch(() => ({ data: [] }))
        ]).then(([regRes, certRes, annRes]) => {
            if (regRes.data) setRegistrations(regRes.data);
            if (certRes.data) setCertificates(certRes.data);
            if (annRes.data) setAnnouncements(annRes.data);
            setLoading(false);
        });
    }, []);

    const approvedCount = registrations.filter((r) => r.status === 'APPROVED').length;
    const pendingCount = registrations.filter((r) => r.status === 'PENDING').length;

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
                        <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Student Portal</span>
                        <h1>Student Telemetry Dashboard</h1>
                        <p>Welcome back, {user?.fullName}! Track your event bookings, ticket status, and certificates.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <NavLink to="/events" className="btn btn-primary btn-sm">
                            + Explore New Events
                        </NavLink>
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="kpi-grid">
                    <div className="kpi-card">
                        <div className="kpi-label">Total Registrations</div>
                        <div className="kpi-value">{registrations.length}</div>
                        <div className="kpi-subtext">All submitted event signups</div>
                    </div>
                    <div className="kpi-card">
                        <div className="kpi-label">Confirmed Seats</div>
                        <div className="kpi-value" style={{ color: 'var(--status-approved-text)' }}>{approvedCount}</div>
                        <div className="kpi-subtext">Approved by administration</div>
                    </div>
                    <div className="kpi-card">
                        <div className="kpi-label">Pending Review</div>
                        <div className="kpi-value" style={{ color: 'var(--status-pending-text)' }}>{pendingCount}</div>
                        <div className="kpi-subtext">Under faculty verification</div>
                    </div>
                    <div className="kpi-card">
                        <div className="kpi-label">Earned Certificates</div>
                        <div className="kpi-value" style={{ color: 'var(--primary-orange)' }}>{certificates.length}</div>
                        <div className="kpi-subtext">Digital credentials issued</div>
                    </div>
                </div>

                {/* Recent Registrations Table */}
                <div className="white-card" style={{ padding: 0, marginBottom: '2rem', overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.15rem', color: 'var(--heading-color)', fontWeight: 800 }}>Your Recent Registrations</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--body-text)' }}>Synchronized with MySQL database</p>
                        </div>
                        <NavLink to="/student/registrations" className="btn btn-secondary btn-sm">
                            View All &rarr;
                        </NavLink>
                    </div>

                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Ticket Code</th>
                                    <th>Event Title</th>
                                    <th>Event Date</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--body-text)' }}>Loading registrations...</td></tr>
                                ) : registrations.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--body-text)' }}>
                                            You haven&apos;t registered for any events yet. <NavLink to="/events" style={{ color: 'var(--primary-orange)', fontWeight: 600 }}>Explore Events &rarr;</NavLink>
                                        </td>
                                    </tr>
                                ) : (
                                    registrations.slice(0, 4).map((r) => {
                                        const badgeClass = r.status === 'APPROVED' ? 'badge-approved' : r.status === 'PENDING' ? 'badge-pending' : 'badge-rejected';
                                        return (
                                            <tr key={r.id}>
                                                <td><code style={{ color: 'var(--primary-orange)', fontWeight: 700 }}>{r.registrationCode}</code></td>
                                                <td><strong style={{ color: 'var(--heading-color)' }}>{r.eventTitle}</strong></td>
                                                <td>{r.eventDate}</td>
                                                <td><span className={`badge ${badgeClass}`}>{r.status}</span></td>
                                                <td style={{ fontSize: '0.85rem', color: 'var(--body-text)' }}>{r.adminRemarks || 'Under verification'}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Campus Announcements */}
                {announcements.length > 0 && (
                    <div className="white-card" style={{ padding: '1.75rem' }}>
                        <h3 style={{ fontSize: '1.15rem', color: 'var(--heading-color)', marginBottom: '1rem', fontWeight: 800 }}>
                            Campus Announcements
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {announcements.map((a) => (
                                <div key={a.id} style={{ padding: '1rem 1.25rem', background: 'var(--light-orange-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                    <strong style={{ color: 'var(--heading-color)', fontSize: '0.95rem' }}>{a.title}</strong>
                                    <p style={{ color: 'var(--body-text)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>{a.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
