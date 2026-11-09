import { NavLink } from 'react-router-dom';

export default function EventCard({ event, onRegister, isRegistered = false, showRegisterButton = true }) {
    const regCount = event.currentRegistrations || 0;
    const capacity = event.maxCapacity || 100;
    const pct = Math.min(100, Math.round((regCount / capacity) * 100));
    const isFull = regCount >= capacity;

    const defaultImage = "/cutmap_events/cutmap_semicon_arena.jpg";

    return (
        <div className="glass-event-card">
            <div className="event-card-media">
                <img
                    src={event.imageUrl || defaultImage}
                    alt={event.title}
                    loading="lazy"
                    className="event-card-img"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultImage;
                    }}
                />
                <span className="event-category-pill">{event.category}</span>
                <span className={`event-status-pill ${event.status === 'ACTIVE' ? 'active' : event.status === 'COMPLETED' ? 'completed' : 'closed'}`}>
                    {event.status}
                </span>
                {event.permissionStatus === 'UNAVAILABLE' && (
                    <span style={{
                        position: 'absolute',
                        bottom: '0.75rem',
                        left: '0.75rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: 'rgba(239, 68, 68, 0.9)',
                        color: '#fff',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                        backdropFilter: 'blur(4px)'
                    }}>
                        Photo Pending
                    </span>
                )}
            </div>

            <div className="event-card-body">
                <h3 className="event-card-title">{event.title}</h3>
                <p className="event-card-venue">{event.venue}</p>

                <div className="event-card-schedule">
                    <span className="schedule-date">{event.eventDate}</span>
                    <span className="schedule-dot">&bull;</span>
                    <span className="schedule-time">{event.eventTime}</span>
                </div>

                <p className="event-card-desc">
                    {event.description?.length > 120
                        ? `${event.description.substring(0, 120)}...`
                        : event.description}
                </p>

                {/* Capacity Occupancy Bar */}
                <div className="event-capacity-section">
                    <div className="capacity-label-row">
                        <span>Seat Occupancy</span>
                        <span className="capacity-fraction">
                            {regCount} / {capacity} ({pct}%)
                        </span>
                    </div>
                    <div className="capacity-bar-track">
                        <div
                            className="capacity-bar-fill"
                            style={{
                                width: `${pct}%`,
                                background: pct >= 95 ? '#DC2626' : pct >= 80 ? '#D97706' : 'var(--primary-orange)'
                            }}
                        />
                    </div>
                </div>

                <div className="event-card-actions">
                    <NavLink
                        to={`/events/${event.id}`}
                        className="btn btn-secondary btn-sm btn-pill"
                        style={{ flex: 1, textAlign: 'center' }}
                    >
                        View Details
                    </NavLink>

                    {showRegisterButton && (
                        isRegistered ? (
                            <span className="badge badge-approved" style={{ padding: '0.45rem 1rem' }}>
                                Registered
                            </span>
                        ) : event.status === 'COMPLETED' ? (
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0.45rem 0.9rem',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    borderRadius: '999px',
                                    background: '#F1F5F9',
                                    color: '#64748B',
                                    border: '1px solid #E2E8F0',
                                    letterSpacing: '0.02em'
                                }}
                            >
                                Event Completed
                            </span>
                        ) : isFull ? (
                            <NavLink
                                to={`/events/${event.id}`}
                                className="btn btn-secondary btn-sm btn-pill"
                                style={{ color: '#fbbf24' }}
                            >
                                Join Waitlist
                            </NavLink>
                        ) : (
                            <button
                                onClick={() => onRegister && onRegister(event.id)}
                                className="btn btn-primary btn-sm btn-pill"
                                style={{ flex: 1 }}
                            >
                                Register
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

