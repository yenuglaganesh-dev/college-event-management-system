import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from '../../components/Toast';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const res = await api.dashboard.getAdminStats();
            setStats(res.data);
        } catch (err) {
            toast.error(err.message || 'Failed to load administrative telemetry');
        } finally {
            setLoading(false);
        }
    };

    const handleQuickStatus = async (id, status) => {
        try {
            setActionLoading(id);
            await api.registrations.updateStatus(id, status, `Quick ${status.toLowerCase()} from admin console`);
            toast.success(`Registration ${status.toLowerCase()} successfully`);
            await loadStats();
        } catch (err) {
            toast.error(err.message || 'Action failed');
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED': return <span className="badge badge-approved">Approved</span>;
            case 'PENDING': return <span className="badge badge-pending">Pending Review</span>;
            case 'REJECTED': return <span className="badge badge-rejected">Rejected</span>;
            case 'CANCELLED': return <span className="badge" style={{ background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB' }}>Cancelled</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    return (
        <div className="section-py" style={{ minHeight: '85vh' }}>
            <div className="container">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Command Center</span>
                        <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800, color: 'var(--heading-color)', letterSpacing: '-0.02em' }}>
                            Institutional <span style={{ color: 'var(--primary-orange)' }}>Overview</span>
                        </h1>
                        <p style={{ color: 'var(--body-text)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
                            Live telemetry across student registrations, upcoming collegiate events, and approvals.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <Link to="/admin/events" className="btn btn-primary">
                            + Create Event
                        </Link>
                        <Link to="/admin/registrations" className="btn btn-secondary">
                            Review Queue ({stats?.pendingRegistrations || 0})
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>
                        <div className="spinner"></div>
                        <p style={{ color: 'var(--body-text)', marginTop: '1.25rem' }}>Aggregating system statistics...</p>
                    </div>
                ) : (
                    <>
                        {/* KPI Cards Grid */}
                        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2.5rem' }}>
                            <div className="white-card stat-card">
                                <span className="stat-label">Total Events</span>
                                <div className="stat-number">{stats?.totalEvents ?? 0}</div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--primary-orange)', fontWeight: 600 }}>{stats?.activeEvents ?? 0} Currently Active</span>
                            </div>

                            <div className="white-card stat-card">
                                <span className="stat-label">Registered Students</span>
                                <div className="stat-number">{stats?.totalStudents ?? 0}</div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--body-text)' }}>Enrolled in database</span>
                            </div>

                            <div className="white-card stat-card">
                                <span className="stat-label">Total Applications</span>
                                <div className="stat-number">{stats?.totalRegistrations ?? 0}</div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--body-text)' }}>All-time submissions</span>
                            </div>

                            <div className="white-card stat-card" style={{ borderColor: stats?.pendingRegistrations > 0 ? 'var(--primary-orange)' : undefined }}>
                                <span className="stat-label" style={{ color: stats?.pendingRegistrations > 0 ? 'var(--primary-orange)' : undefined }}>
                                    Pending Approvals
                                </span>
                                <div className="stat-number" style={{ color: stats?.pendingRegistrations > 0 ? 'var(--primary-orange)' : undefined }}>
                                    {stats?.pendingRegistrations ?? 0}
                                </div>
                                <span style={{ fontSize: '0.8rem', color: stats?.pendingRegistrations > 0 ? 'var(--primary-orange)' : 'var(--body-text)', fontWeight: 600 }}>Action required</span>
                            </div>

                            <div className="white-card stat-card">
                                <span className="stat-label">Approved Attendees</span>
                                <div className="stat-number" style={{ color: 'var(--status-approved-text)' }}>
                                    {stats?.approvedRegistrations ?? 0}
                                </div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--status-approved-text)', fontWeight: 600 }}>Tickets issued</span>
                            </div>

                            <div className="white-card stat-card">
                                <span className="stat-label">Rejections / Cancellations</span>
                                <div className="stat-number" style={{ color: 'var(--body-text)' }}>
                                    {(stats?.rejectedRegistrations ?? 0) + (stats?.cancelledRegistrations ?? 0)}
                                </div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--body-text)' }}>Archived records</span>
                            </div>
                        </div>

                        {/* Recent Activity Table */}
                        <div className="white-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 800, color: 'var(--heading-color)' }}>Recent Submissions Queue</h2>
                                    <p style={{ color: 'var(--body-text)', fontSize: '0.9rem', margin: '0.2rem 0 0 0' }}>
                                        Immediate view of the latest student event applications.
                                    </p>
                                </div>
                                <Link to="/admin/registrations" className="btn btn-secondary btn-sm">
                                    View Full Register &rarr;
                                </Link>
                            </div>

                            {(!stats?.recentRegistrations || stats.recentRegistrations.length === 0) ? (
                                <p style={{ color: 'var(--body-text)', textAlign: 'center', padding: '2rem 0' }}>
                                    No student applications submitted yet.
                                </p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Reference</th>
                                                <th>Student</th>
                                                <th>Event Name</th>
                                                <th>Submitted</th>
                                                <th>Status</th>
                                                <th style={{ textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.recentRegistrations.map((reg) => (
                                                <tr key={reg.id}>
                                                    <td>
                                                        <code style={{ color: 'var(--primary-orange)', fontWeight: 700, fontSize: '0.85rem' }}>{reg.registrationCode}</code>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontWeight: 700, color: 'var(--heading-color)' }}>{reg.studentName}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--body-text)' }}>{reg.studentDepartment} | {reg.studentId}</div>
                                                    </td>
                                                    <td style={{ color: 'var(--heading-color)', fontWeight: 600 }}>{reg.eventTitle}</td>
                                                    <td style={{ fontSize: '0.85rem', color: 'var(--body-text)' }}>
                                                        {reg.registrationDateFormatted || reg.registrationDateTime}
                                                    </td>
                                                    <td>{getStatusBadge(reg.status)}</td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        {reg.status === 'PENDING' ? (
                                                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary btn-sm"
                                                                    style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                                                                    disabled={actionLoading === reg.id}
                                                                    onClick={() => handleQuickStatus(reg.id, 'APPROVED')}
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-secondary btn-sm"
                                                                    style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', color: '#dc2626', borderColor: '#fca5a5' }}
                                                                    disabled={actionLoading === reg.id}
                                                                    onClick={() => handleQuickStatus(reg.id, 'REJECTED')}
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span style={{ fontSize: '0.8rem', color: 'var(--body-text)', fontWeight: 600 }}>Processed</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Quick Admin Navigation Grid */}
                        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                            <Link to="/admin/events" className="white-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--heading-color)', marginBottom: '0.35rem' }}>Event Catalog</div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--body-text)', margin: 0 }}>Add, edit, and configure venue capacities.</p>
                            </Link>

                            <Link to="/admin/attendance" className="white-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--heading-color)', marginBottom: '0.35rem' }}>QR Attendance Scanner</div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--body-text)', margin: 0 }}>Verify e-ticket passes at venue check-in.</p>
                            </Link>

                            <Link to="/admin/certificates" className="white-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--heading-color)', marginBottom: '0.35rem' }}>Credential Issuance</div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--body-text)', margin: 0 }}>Generate verifiable digital certificates.</p>
                            </Link>

                            <Link to="/admin/reports" className="white-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--heading-color)', marginBottom: '0.35rem' }}>Data & CSV Exports</div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--body-text)', margin: 0 }}>Export complete attendance and registry lists.</p>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
