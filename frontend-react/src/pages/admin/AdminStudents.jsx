import React, { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import { toast } from '../../components/Toast';

export default function AdminStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('ALL');

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const res = await api.students.getAllForAdmin();
            setStudents(res.data || []);
        } catch (err) {
            toast.error(err.message || 'Failed to fetch student directory');
        } finally {
            setLoading(false);
        }
    };

    const departments = useMemo(() => {
        const set = new Set();
        students.forEach(s => {
            if (s.department) set.add(s.department);
        });
        return Array.from(set).sort();
    }, [students]);

    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;
            const term = search.toLowerCase();
            const matchesSearch = !term ||
                (s.fullName && s.fullName.toLowerCase().includes(term)) ||
                (s.rollNumber && s.rollNumber.toLowerCase().includes(term)) ||
                (s.email && s.email.toLowerCase().includes(term));
            return matchesDept && matchesSearch;
        });
    }, [students, deptFilter, search]);

    return (
        <div className="section-py" style={{ minHeight: '85vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Directory</span>
                        <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800, color: 'var(--heading-color)', letterSpacing: '-0.02em' }}>
                            Registered <span style={{ color: 'var(--primary-orange)' }}>Students</span>
                        </h1>
                        <p style={{ color: 'var(--body-text)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
                            View enrolled undergraduate and postgraduate students registered on the platform.
                        </p>
                    </div>
                    <div style={{ color: 'var(--body-text)', fontSize: '0.95rem', fontWeight: 600 }}>
                        Total Enrolled: <strong style={{ color: 'var(--primary-orange)' }}>{students.length}</strong>
                    </div>
                </div>

                {/* Filter bar */}
                <div className="white-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                        <div>
                            <label className="form-label">Search Directory</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name, roll number, or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="form-label">Filter Department</label>
                            <select
                                className="form-select"
                                value={deptFilter}
                                onChange={(e) => setDeptFilter(e.target.value)}
                            >
                                <option value="ALL">All Departments</option>
                                {departments.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="spinner"></div>
                        <p style={{ color: 'var(--body-text)', marginTop: '1rem' }}>Loading students from database...</p>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="white-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--body-text)', fontSize: '1.05rem' }}>No students match the criteria.</p>
                    </div>
                ) : (
                    <div className="white-card" style={{ padding: '2rem' }}>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Roll Number</th>
                                        <th>Full Legal Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Department</th>
                                        <th>Year</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((s) => (
                                        <tr key={s.id}>
                                            <td>
                                                <code style={{ color: 'var(--primary-orange)', fontWeight: 700, fontSize: '0.85rem' }}>{s.rollNumber}</code>
                                            </td>
                                            <td style={{ fontWeight: 700, color: 'var(--heading-color)' }}>
                                                {s.fullName}
                                            </td>
                                            <td style={{ color: 'var(--body-text)', fontSize: '0.9rem' }}>
                                                {s.email}
                                            </td>
                                            <td style={{ color: 'var(--body-text)', fontSize: '0.9rem' }}>
                                                {s.phoneNumber || 'N/A'}
                                            </td>
                                            <td>
                                                <span className="badge badge-primary">
                                                    {s.department || 'General'}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.9rem', color: 'var(--heading-color)', fontWeight: 600 }}>
                                                Year {s.yearOfStudy || '1'}
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
