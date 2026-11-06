import { useState } from 'react';
import { showToast } from '../components/Toast';

export default function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            showToast('Inquiry transmitted to campus coordination cell. We will reply via email shortly.', 'success');
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
            setSubmitting(false);
        }, 500);
    };

    return (
        <div className="section-container" style={{ maxWidth: '1040px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span className="brand-badge" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
                    Campus Coordination Cell
                </span>
                <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--heading-color)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                    Student Activities <span style={{ color: 'var(--primary-orange)' }}>Helpdesk</span>
                </h1>
                <p style={{ color: 'var(--body-text)', maxWidth: '560px', margin: '0.75rem auto 0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
                    Have questions regarding event eligibility, club sponsorships, venue reservations, or technical guidelines?
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '2rem' }}>
                {/* Details Card */}
                <div className="white-card" style={{ padding: '2.25rem' }}>
                    <h3 style={{ fontSize: '1.35rem', color: 'var(--heading-color)', marginBottom: '1.5rem', fontWeight: 800 }}>Office Contacts</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <div style={{ color: 'var(--primary-orange)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Location</div>
                            <strong style={{ color: 'var(--heading-color)', fontSize: '1.05rem' }}>Room 204, Student Activity Center (SAC)</strong>
                            <p style={{ color: 'var(--body-text)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Technology Block, University Main Campus</p>
                        </div>

                        <div>
                            <div style={{ color: 'var(--primary-orange)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Email Inquiries</div>
                            <p style={{ color: 'var(--body-text)', fontSize: '0.9rem', margin: 0 }}>
                                General: <a href="mailto:events@college.edu" style={{ color: 'var(--primary-orange)', fontWeight: 600 }}>events@college.edu</a><br />
                                Administration: <a href="mailto:admin@college.edu" style={{ color: 'var(--primary-orange)', fontWeight: 600 }}>admin@college.edu</a>
                            </p>
                        </div>

                        <div>
                            <div style={{ color: 'var(--primary-orange)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Helpline Numbers</div>
                            <p style={{ color: 'var(--body-text)', fontSize: '0.9rem', margin: 0 }}>
                                Event Cell: <strong style={{ color: 'var(--heading-color)' }}>+91 (040) 2345-6789</strong><br />
                                Student Desk: <strong style={{ color: 'var(--heading-color)' }}>+91 (040) 2345-6790</strong>
                            </p>
                        </div>

                        <div>
                            <div style={{ color: 'var(--primary-orange)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Office Hours</div>
                            <p style={{ color: 'var(--body-text)', fontSize: '0.9rem', margin: 0 }}>
                                Monday through Friday: 09:00 AM &ndash; 05:30 PM<br />
                                Saturday: 09:30 AM &ndash; 01:30 PM
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="white-card" style={{ padding: '2.25rem' }}>
                    <h3 style={{ fontSize: '1.35rem', color: 'var(--heading-color)', marginBottom: '0.5rem', fontWeight: 800 }}>Send an Inquiry</h3>
                    <p style={{ color: 'var(--body-text)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                        Fill out the message form below and the coordination cell will respond to your email.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Full Name *</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Student or Faculty Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address *</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="name@college.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Subject</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Hackathon Team Registration Question"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Message Details *</label>
                            <textarea
                                className="form-control"
                                rows={4}
                                placeholder="How can we assist you?"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', fontWeight: 700 }} disabled={submitting}>
                            {submitting ? 'Transmitting...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
