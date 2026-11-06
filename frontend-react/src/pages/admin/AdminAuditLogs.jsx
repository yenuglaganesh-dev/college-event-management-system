import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from '../../components/Toast';

export default function AdminAuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const res = await api.auditLogs.getAll();
            setLogs(res.data || []);
        } catch (err) {
            toast.error(err.message || 'Failed to fetch audit log trail');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section-py" style={{ minHeight: '85vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Security</span>
                        <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800, color: 'var(--heading-color)', letterSpacing: '-0.02em' }}>
                            System Audit <span style={{ color: 'var(--primary-orange)' }}>Trail</span>
                        </h1>
                        <p style={{ color: 'var(--body-text)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
                            Immutable audit trail of administrator and student actions, registrations, and status overrides.
                        </p>
                    </div>
                    <button type="button" className="btn btn-secondary" onClick={loadLogs}>
                        Refresh Logs
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="spinner"></div>
                        <p style={{ color: 'var(--body-text)', marginTop: '1rem' }}>Querying audit store...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="white-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--body-text)', fontSize: '1.05rem' }}>No audit events logged yet.</p>
                    </div>
                ) : (
                    <div className="white-card" style={{ padding: '2rem' }}>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Log ID</th>
                                        <th>Action Taken</th>
                                        <th>Principal Actor</th>
                                        <th>Security Role</th>
                                        <th>Client IP</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((l) => (
                                        <tr key={l.id}>
                                            <td style={{ fontWeight: 700 }}>#{l.id}</td>
                                            <td style={{ fontWeight: 700, color: 'var(--primary-orange)' }}>
                                                {l.action}
                                            </td>
                                            <td style={{ color: 'var(--heading-color)', fontWeight: 600 }}>
                                                {l.username || 'System'}
                                            </td>
                                            <td>
                                                <span className="badge badge-primary">
                                                    {l.role || 'GUEST'}
                                                </span>
                                            </td>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--body-text)' }}>
                                                {l.ipAddress || '127.0.0.1'}
                                            </td>
                                            <td style={{ fontSize: '0.85rem', color: 'var(--body-text)' }}>
                                                {l.createdAt}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
