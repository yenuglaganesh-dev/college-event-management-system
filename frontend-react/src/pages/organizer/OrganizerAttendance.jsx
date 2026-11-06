import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from '../../components/Toast';

export default function OrganizerAttendance() {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ticketCodeInput, setTicketCodeInput] = useState('');
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);

    useEffect(() => {
        loadEvents();
    }, []);

    useEffect(() => {
        if (selectedEventId) {
            loadAttendance(selectedEventId);
        }
    }, [selectedEventId]);

    const loadEvents = async () => {
        try {
            const res = await api.organizers.getMyEvents();
            const list = res.data || [];
            setEvents(list);
            if (list.length > 0) {
                setSelectedEventId(String(list[0].id));
            }
        } catch (err) {
            toast.error(err.message || 'Failed to load events');
        }
    };

    const loadAttendance = async (eventId) => {
        try {
            setLoading(true);
            const res = await api.attendance.getEventAttendance(eventId);
            setAttendances(res.data || []);
        } catch (err) {
            toast.error(err.message || 'Failed to fetch attendance roster');
        } finally {
            setLoading(false);
        }
    };

    const handleScanTicket = async (e) => {
        e.preventDefault();
        if (!ticketCodeInput.trim()) return;

        try {
            setScanning(true);
            setScanResult(null);
            const res = await api.attendance.scanTicket(ticketCodeInput.trim().toUpperCase());
            toast.success(res.message || 'Pass verified successfully');
            setScanResult({
                success: true,
                message: res.message,
                data: res.data
            });
            setTicketCodeInput('');
            if (selectedEventId) {
                await loadAttendance(selectedEventId);
            }
        } catch (err) {
            setScanResult({
                success: false,
                message: err.message || 'Scan verification failed'
            });
            toast.error(err.message || 'Scan failed');
        } finally {
            setScanning(false);
        }
    };

    return (
        <div className="section-py" style={{ minHeight: '85vh' }}>
            <div className="container">
                <div style={{ marginBottom: '2.5rem' }}>
                    <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Gate Verification</span>
                    <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800, color: 'var(--heading-color)', letterSpacing: '-0.02em' }}>
                        Organizer QR Ticket <span style={{ color: 'var(--primary-orange)' }}>Check-In</span>
                    </h1>
                    <p style={{ color: 'var(--body-text)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
                        Scan student digital QR passes at the entrance to verify attendance in real-time.
                    </p>
                </div>

                {/* QR Scanner / Input Terminal */}
                <div className="white-card" style={{ padding: '2rem', marginBottom: '2.5rem', borderColor: 'var(--primary-orange)', borderWidth: '2px' }}>
                    <h3 style={{ fontSize: '1.35rem', marginTop: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--heading-color)' }}>
                        <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--status-approved-text)' }}></span>
                        Entrance Scanner
                    </h3>
                    <form onSubmit={handleScanTicket} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            className="form-control"
                            style={{ flex: 1, minWidth: '260px', fontFamily: 'monospace', fontSize: '1.15rem', letterSpacing: '0.05em', fontWeight: 700 }}
                            placeholder="Enter or scan ticket reference (e.g. REG-1-4A2B1C)"
                            value={ticketCodeInput}
                            onChange={(e) => setTicketCodeInput(e.target.value)}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={scanning}
                            style={{ minWidth: '180px', padding: '0.75rem 1.5rem', fontWeight: 700 }}
                        >
                            {scanning ? 'Verifying...' : 'Verify Ticket'}
                        </button>
                    </form>

                    {scanResult && (
                        <div style={{ 
                            marginTop: '1.5rem', 
                            padding: '1.25rem', 
                            borderRadius: 'var(--radius-md)', 
                            background: scanResult.success ? 'var(--status-approved-bg)' : 'var(--status-rejected-bg)',
                            border: `1.5px solid ${scanResult.success ? 'var(--status-approved-border)' : 'var(--status-rejected-border)'}`
                        }}>
                            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: scanResult.success ? 'var(--status-approved-text)' : 'var(--status-rejected-text)' }}>
                                {scanResult.success ? '✓ VALID PASS - ADMIT ATTENDEE' : '✕ INVALID PASS - DO NOT ADMIT'}
                            </div>
                            <div style={{ fontSize: '0.95rem', color: 'var(--heading-color)', marginTop: '0.35rem', fontWeight: 600 }}>
                                {scanResult.message}
                            </div>
                        </div>
                    )}
                </div>

                {/* Event Attendance Roster */}
                <div className="white-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 800, color: 'var(--heading-color)' }}>Event Gate Attendance</h3>
                            <p style={{ color: 'var(--body-text)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                                Confirmed check-ins for this event.
                            </p>
                        </div>
                        <div style={{ minWidth: '260px' }}>
                            <select
                                className="form-select"
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(e.target.value)}
                            >
                                {events.map((e) => (
                                    <option key={e.id} value={e.id}>{e.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <div className="spinner"></div>
                            <p style={{ color: 'var(--body-text)', marginTop: '1rem' }}>Loading check-ins...</p>
                        </div>
                    ) : attendances.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3.5rem' }}>
                            <p style={{ color: 'var(--body-text)', fontSize: '1.05rem' }}>No attendees checked in yet.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Check-In ID</th>
                                        <th>Registration Code</th>
                                        <th>Student ID</th>
                                        <th>Timestamp</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendances.map((att) => (
                                        <tr key={att.id}>
                                            <td style={{ fontWeight: 700 }}>#{att.id}</td>
                                            <td>
                                                <code style={{ color: 'var(--primary-orange)', fontWeight: 700, fontSize: '0.85rem' }}>REG #{att.registrationId}</code>
                                            </td>
                                            <td style={{ fontWeight: 600, color: 'var(--heading-color)' }}>STU #{att.studentId}</td>
                                            <td style={{ fontSize: '0.85rem', color: 'var(--body-text)' }}>
                                                {att.checkInTime}
                                            </td>
                                            <td>
                                                <span className="badge badge-approved">ADMITTED</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
