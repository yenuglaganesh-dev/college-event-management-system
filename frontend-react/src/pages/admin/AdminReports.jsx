import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from '../../components/Toast';

export default function AdminReports() {
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReportData();
    }, []);

    const loadReportData = async () => {
        try {
            setLoading(true);
            const [eventsRes, regRes, stuRes] = await Promise.all([
                api.events.getAll(),
                api.registrations.getAllForAdmin(),
                api.students.getAllForAdmin()
            ]);
            setEvents(eventsRes.data || []);
            setRegistrations(regRes.data || []);
            setStudents(stuRes.data || []);
        } catch (err) {
            toast.error(err.message || 'Failed to aggregate report data');
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = (filename, headers, rows) => {
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Exported ${filename} successfully`);
    };

    const handleExportRegistrations = () => {
        const headers = ['Reg ID', 'Reference Code', 'Student ID', 'Student Name', 'Email', 'Event Name', 'Date', 'Status', 'Admin Remarks'];
        const rows = registrations.map(r => [
            r.id,
            r.registrationCode,
            `"${r.studentId || ''}"`,
            `"${r.studentName || ''}"`,
            `"${r.studentEmail || ''}"`,
            `"${r.eventTitle || ''}"`,
            `"${r.eventDate || ''}"`,
            r.status,
            `"${(r.adminRemarks || '').replace(/"/g, '""')}"`
        ]);
        exportCSV('CEMS_Registrations_Master', headers, rows);
    };

    const handleExportEvents = () => {
        const headers = ['Event ID', 'Title', 'Category', 'Date', 'Venue', 'Capacity', 'Registered', 'Occupancy Pct', 'Status'];
        const rows = events.map(e => [
            e.id,
            `"${e.title}"`,
            `"${e.category}"`,
            `"${e.eventDate}"`,
            `"${e.venue}"`,
            e.maxCapacity,
            e.registeredCount || 0,
            `${Math.min(100, Math.round(((e.registeredCount || 0) / (e.maxCapacity || 1)) * 100))}%`,
            e.status
        ]);
        exportCSV('CEMS_Events_Roster', headers, rows);
    };

    const handleExportStudents = () => {
        const headers = ['Student ID', 'Roll Number', 'Full Name', 'Email', 'Phone', 'Department', 'Year of Study'];
        const rows = students.map(s => [
            s.id,
            `"${s.rollNumber}"`,
            `"${s.fullName}"`,
            `"${s.email}"`,
            `"${s.phoneNumber || ''}"`,
            `"${s.department || ''}"`,
            `"${s.yearOfStudy || ''}"`
        ]);
        exportCSV('CEMS_Students_Directory', headers, rows);
    };

    return (
        <div className="section-py" style={{ minHeight: '85vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Analytics</span>
                        <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800, color: 'var(--heading-color)', letterSpacing: '-0.02em' }}>
                            Reports & <span style={{ color: 'var(--primary-orange)' }}>Data Export</span>
                        </h1>
                        <p style={{ color: 'var(--body-text)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
                            Comprehensive institutional analytics, capacity breakdowns, and automated CSV reports.
                        </p>
                    </div>
                </div>

                {/* CSV Exports Card Group */}
                <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: '2.5rem' }}>
                    <div className="white-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <span className="badge badge-primary" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>Master File</span>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--heading-color)' }}>Student Registrations Master</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--body-text)', margin: 0, lineHeight: 1.5 }}>
                                Complete list of all student submissions, statuses, remarks, and timestamps.
                            </p>
                            <div style={{ fontSize: '0.85rem', color: 'var(--primary-orange)', marginTop: '0.75rem', fontWeight: 700 }}>
                                Total Records: <strong>{registrations.length}</strong>
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} onClick={handleExportRegistrations}>
                            Download Registrations CSV
                        </button>
                    </div>

                    <div className="white-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <span className="badge badge-primary" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>Capacity Breakdown</span>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--heading-color)' }}>Events Occupancy Roster</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--body-text)', margin: 0, lineHeight: 1.5 }}>
                                Complete inventory of events, venue locations, participant limits, and seat fillings.
                            </p>
                            <div style={{ fontSize: '0.85rem', color: 'var(--primary-orange)', marginTop: '0.75rem', fontWeight: 700 }}>
                                Total Events: <strong>{events.length}</strong>
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} onClick={handleExportEvents}>
                            Download Events CSV
                        </button>
                    </div>

                    <div className="white-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <span className="badge badge-primary" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>Enrollment</span>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--heading-color)' }}>Student Directory Export</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--body-text)', margin: 0, lineHeight: 1.5 }}>
                                Full database directory of enrolled students across all academic departments.
                            </p>
                            <div style={{ fontSize: '0.85rem', color: 'var(--primary-orange)', marginTop: '0.75rem', fontWeight: 700 }}>
                                Total Students: <strong>{students.length}</strong>
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} onClick={handleExportStudents}>
                            Download Students CSV
                        </button>
                    </div>
                </div>

                {/* Event Occupancy Analytics */}
                <div className="white-card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.4rem', marginTop: 0, marginBottom: '0.5rem', fontWeight: 800, color: 'var(--heading-color)' }}>Live Capacity Meters</h3>
                    <p style={{ color: 'var(--body-text)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                        Visual occupancy and reservation breakdown across all active campus events.
                    </p>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {events.map((evt) => {
                                const registered = evt.registeredCount || 0;
                                const capacity = evt.maxCapacity || 1;
                                const pct = Math.min(100, Math.round((registered / capacity) * 100));

                                return (
                                    <div key={evt.id} style={{ background: 'var(--light-orange-subtle)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            <div>
                                                <strong style={{ color: 'var(--heading-color)', fontSize: '1.05rem', fontWeight: 700 }}>{evt.title}</strong>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--body-text)', marginLeft: '0.75rem' }}>{evt.venue} &bull; {evt.eventDate}</span>
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--body-text)' }}>
                                                <span style={{ fontWeight: 800, color: pct >= 100 ? '#dc2626' : 'var(--primary-orange)' }}>{registered}</span> / {capacity} seats ({pct}%)
                                            </div>
                                        </div>
                                        <div className="capacity-bar-track" style={{ height: '8px' }}>
                                            <div className="capacity-bar-fill" style={{ width: `${pct}%`, background: pct >= 100 ? '#dc2626' : 'var(--primary-orange)' }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
