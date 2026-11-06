import React, { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import { toast } from '../../components/Toast';

export default function AdminRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [eventFilter, setEventFilter] = useState('ALL');
    const [actionModal, setActionModal] = useState(null); // { reg, action: 'APPROVED' | 'REJECTED' }
    const [remarks, setRemarks] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [detailModalReg, setDetailModalReg] = useState(null);
    const [autoSync, setAutoSync] = useState(true);

    useEffect(() => {
        loadRegistrations();

        // 8-second auto-poll interval for live student submissions
        let interval = null;
        if (autoSync) {
            interval = setInterval(() => {
                loadRegistrations(true);
            }, 8000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoSync]);

    const loadRegistrations = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const res = await api.registrations.getAllForAdmin();
            setRegistrations(res.data || []);
        } catch (err) {
            if (!silent) toast.error(err.message || 'Failed to fetch registrations');
        } finally {
            if (!silent) setLoading(false);
        }
    };

    // Extract unique event titles for the filter dropdown
    const eventTitles = useMemo(() => {
        const set = new Set();
        registrations.forEach(r => {
            if (r.eventTitle) set.add(r.eventTitle);
        });
        return Array.from(set).sort();
    }, [registrations]);

    // Filter registrations
    const filteredRegistrations = useMemo(() => {
        return registrations.filter(r => {
            const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
            const matchesEvent = eventFilter === 'ALL' || r.eventTitle === eventFilter;
            const term = searchTerm.toLowerCase();
            const matchesSearch = !term ||
                (r.studentName && r.studentName.toLowerCase().includes(term)) ||
                (r.studentId && r.studentId.toLowerCase().includes(term)) ||
                (r.registrationCode && r.registrationCode.toLowerCase().includes(term)) ||
                (r.eventTitle && r.eventTitle.toLowerCase().includes(term)) ||
                (r.studentEmail && r.studentEmail.toLowerCase().includes(term));

            return matchesStatus && matchesEvent && matchesSearch;
        });
    }, [registrations, statusFilter, eventFilter, searchTerm]);

    const handleOpenAction = (reg, action) => {
        setActionModal({ reg, action });
        setRemarks(action === 'APPROVED' ? 'Application meets eligibility criteria. Pass issued.' : 'Application declined by collegiate committee.');
    };

    const handleConfirmStatus = async () => {
        if (!actionModal) return;
        try {
            setSubmitting(true);
            await api.registrations.updateStatus(actionModal.reg.id, actionModal.action, remarks);
            toast.success(`Registration #${actionModal.reg.registrationCode} marked as ${actionModal.action}`);
            setActionModal(null);
            setRemarks('');
            await loadRegistrations(true);
        } catch (err) {
            toast.error(err.message || 'Action failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleExportCSV = () => {
        if (filteredRegistrations.length === 0) {
            toast.warning('No records to export in the current view');
            return;
        }

        const headers = ['Reg ID', 'Reference Code', 'Student ID', 'Student Name', 'Email', 'Phone', 'Department', 'Year', 'Event Name', 'Date', 'Status', 'Remarks', 'Submitted At'];
        const rows = filteredRegistrations.map(r => [
            r.id,
            r.registrationCode,
            `"${r.studentId || ''}"`,
            `"${r.studentName || ''}"`,
            `"${r.studentEmail || ''}"`,
            `"${r.studentPhone || ''}"`,
            `"${r.studentDepartment || ''}"`,
            `"${r.studentYear || ''}"`,
            `"${r.eventTitle || ''}"`,
            `"${r.eventDate || ''}"`,
            r.status,
            `"${(r.adminRemarks || '').replace(/"/g, '""')}"`,
            `"${r.registrationDateFormatted || r.registrationDateTime || ''}"`
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `CEMS_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Exported ${filteredRegistrations.length} registrations to CSV`);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED': return <span className="badge badge-approved">Approved</span>;
            case 'PENDING': return <span className="badge badge-pending">Pending</span>;
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
                        <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Verification Gate</span>
                        <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800, color: 'var(--heading-color)', letterSpacing: '-0.02em' }}>
                            Event Registrations <span style={{ color: 'var(--primary-orange)' }}>Management</span>
                        </h1>
                        <p style={{ color: 'var(--body-text)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
                            Authoritative control plane for student attendance verification, approvals, and seat allocations.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={handleExportCSV}
                            title="Export current view to CSV"
                        >
                            Export CSV
                        </button>
                        <button 
                            type="button" 
                            className={autoSync ? 'btn btn-primary' : 'btn btn-secondary'}
                            onClick={() => setAutoSync(!autoSync)}
                            title="Toggle automatic 8-second refresh"
                        >
                            {autoSync ? 'Auto-Sync: ON (8s)' : 'Auto-Sync: OFF'}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={() => loadRegistrations()}
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                <div className="white-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', alignItems: 'flex-end' }}>
                        <div>
                            <label className="form-label">Search Query</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Student, roll, email, code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="form-label">Status Filter</label>
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="PENDING">Pending Review Only</option>
                                <option value="APPROVED">Approved Only</option>
                                <option value="REJECTED">Rejected Only</option>
                                <option value="CANCELLED">Cancelled Only</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Event Filter</label>
                            <select
                                className="form-select"
                                value={eventFilter}
                                onChange={(e) => setEventFilter(e.target.value)}
                            >
                                <option value="ALL">All Events ({eventTitles.length})</option>
                                {eventTitles.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Registrations Data Table */}
                <div className="white-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--body-text)', fontWeight: 600 }}>
                            Showing <strong style={{ color: 'var(--primary-orange)' }}>{filteredRegistrations.length}</strong> of {registrations.length} total applications
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem' }}>
                            <div className="spinner"></div>
                            <p style={{ color: 'var(--body-text)', marginTop: '1rem' }}>Loading registrations from MySQL database...</p>
                        </div>
                    ) : filteredRegistrations.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3.5rem' }}>
                            <p style={{ color: 'var(--body-text)', marginBottom: '0.5rem', fontSize: '1.05rem' }}>No registrations matched your criteria.</p>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Try adjusting your search terms or filters.</span>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Ref Code</th>
                                        <th>Student</th>
                                        <th>Event</th>
                                        <th>Department / Year</th>
                                        <th>Submitted</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRegistrations.map((reg) => (
                                        <tr key={reg.id}>
                                            <td>
                                                <code style={{ color: 'var(--primary-orange)', fontWeight: 700, fontSize: '0.85rem' }}>{reg.registrationCode}</code>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 700, color: 'var(--heading-color)' }}>{reg.studentName}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--body-text)' }}>
                                                    {reg.studentId} &bull; {reg.studentEmail}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 700, color: 'var(--heading-color)' }}>{reg.eventTitle}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--body-text)' }}>
                                                    {reg.eventDate} ({reg.eventTime || 'TBA'})
                                                </div>
                                            </td>
                                            <td style={{ fontSize: '0.85rem', color: 'var(--body-text)' }}>
                                                {reg.studentDepartment || 'General'}
                                                {reg.studentYear ? ` (Yr ${reg.studentYear})` : ''}
                                            </td>
                                            <td style={{ fontSize: '0.8rem', color: 'var(--body-text)' }}>
                                                {reg.registrationDateFormatted || reg.registrationDateTime}
                                            </td>
                                            <td>
                                                {getStatusBadge(reg.status)}
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary btn-sm"
                                                        style={{ padding: '0.3rem 0.65rem' }}
                                                        onClick={() => setDetailModalReg(reg)}
                                                    >
                                                        Details
                                                    </button>

                                                    {reg.status === 'PENDING' && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary btn-sm"
                                                                style={{ padding: '0.3rem 0.75rem' }}
                                                                onClick={() => handleOpenAction(reg, 'APPROVED')}
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary btn-sm"
                                                                style={{ padding: '0.3rem 0.75rem', color: '#dc2626', borderColor: '#fca5a5' }}
                                                                onClick={() => handleOpenAction(reg, 'REJECTED')}
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}

                                                    {reg.status === 'APPROVED' && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary btn-sm"
                                                            style={{ padding: '0.3rem 0.75rem', color: '#dc2626', borderColor: '#fca5a5' }}
                                                            onClick={() => handleOpenAction(reg, 'REJECTED')}
                                                        >
                                                            Revoke
                                                        </button>
                                                    )}

                                                    {reg.status === 'REJECTED' && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btn-sm"
                                                            style={{ padding: '0.3rem 0.75rem' }}
                                                            onClick={() => handleOpenAction(reg, 'APPROVED')}
                                                        >
                                                            Re-approve
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Approve / Reject Decision Modal */}
                {actionModal && (
                    <div className="modal-backdrop" onClick={() => setActionModal(null)}>
                        <div 
                            className="white-card" 
                            style={{ maxWidth: '520px', width: '92%', padding: '2.25rem', position: 'relative', boxShadow: 'var(--shadow-lg)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: 0, marginBottom: '0.75rem', color: 'var(--heading-color)' }}>
                                Confirm {actionModal.action === 'APPROVED' ? 'Approval' : 'Rejection'}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--body-text)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                                You are modifying the registration status for <strong style={{ color: 'var(--heading-color)' }}>{actionModal.reg.studentName}</strong> ({actionModal.reg.studentId}) for event <em>{actionModal.reg.eventTitle}</em>.
                            </p>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label">Official Committee Remarks *</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Enter reasoning or instructions for student..."
                                    required
                                />
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    This note will be recorded in MySQL and visible on the student's dashboard.
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setActionModal(null)}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className={actionModal.action === 'APPROVED' ? 'btn btn-primary' : 'btn btn-secondary'}
                                    style={actionModal.action === 'REJECTED' ? { color: '#dc2626', borderColor: '#fca5a5' } : {}}
                                    onClick={handleConfirmStatus}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Updating Database...' : `Confirm ${actionModal.action}`}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Student Full Detail Inspection Modal */}
                {detailModalReg && (
                    <div className="modal-backdrop" onClick={() => setDetailModalReg(null)}>
                        <div 
                            className="white-card" 
                            style={{ maxWidth: '640px', width: '92%', padding: '2.5rem', position: 'relative', boxShadow: 'var(--shadow-lg)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                type="button" 
                                onClick={() => setDetailModalReg(null)}
                                style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'transparent', border: 'none', color: 'var(--body-text)', cursor: 'pointer', fontSize: '1.75rem', lineHeight: 1 }}
                            >
                                &times;
                            </button>

                            <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Record Inspector</span>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 1.25rem 0', color: 'var(--heading-color)' }}>
                                Registration #{detailModalReg.registrationCode}
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--light-orange-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Student Name</div>
                                    <div style={{ fontWeight: 700, color: 'var(--heading-color)' }}>{detailModalReg.studentName}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Student ID / Roll No</div>
                                    <div style={{ fontWeight: 700, color: 'var(--heading-color)' }}>{detailModalReg.studentId}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Email</div>
                                    <div style={{ color: 'var(--heading-color)' }}>{detailModalReg.studentEmail}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Phone</div>
                                    <div style={{ color: 'var(--heading-color)' }}>{detailModalReg.studentPhone || 'N/A'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Department</div>
                                    <div style={{ color: 'var(--heading-color)' }}>{detailModalReg.studentDepartment || 'General'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Year of Study</div>
                                    <div style={{ color: 'var(--heading-color)' }}>Year {detailModalReg.studentYear || '1'}</div>
                                </div>
                            </div>

                            <div style={{ background: 'var(--light-orange-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Applied Event</div>
                                <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary-orange)' }}>{detailModalReg.eventTitle}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--body-text)', marginTop: '0.25rem' }}>
                                    Date: {detailModalReg.eventDate} | Time: {detailModalReg.eventTime || 'TBA'} | Venue: {detailModalReg.eventVenue || 'Main Auditorium'}
                                </div>
                            </div>

                            <div style={{ background: 'var(--light-orange-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Current Status</span>
                                    {getStatusBadge(detailModalReg.status)}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Admin Remarks</div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--heading-color)', margin: '0.25rem 0 0 0', fontStyle: 'italic' }}>
                                    "{detailModalReg.adminRemarks || 'No remarks recorded yet.'}"
                                </p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setDetailModalReg(null)}>
                                    Close Record
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
