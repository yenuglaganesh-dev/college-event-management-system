export default function About() {
    return (
        <div className="page-transition section-container" style={{ maxWidth: '960px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span className="role-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                    Institutional Vision
                </span>
                <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--heading-color)' }}>
                    Unified University <span style={{ color: 'var(--primary-orange)' }}>Event Operations</span>
                </h1>
                <p style={{ color: 'var(--body-text)', maxWidth: '640px', margin: '0.75rem auto 0 auto', fontSize: '1.1rem' }}>
                    Eliminating paper-based bottlenecks and spreadsheet fragmentation through transactional relational architecture.
                </p>
            </div>

            <div className="white-card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--heading-color)', marginBottom: '0.75rem' }}>Platform Objective</h2>
                <p style={{ color: 'var(--body-text)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                    The College Event Management System (CEMS) was engineered to provide students, faculty organizers, and university administrators with a unified, transparent operational environment. Every registration is validated against real-time capacity and stored directly in high-performance MySQL databases.
                </p>
                <p style={{ color: 'var(--body-text)', lineHeight: 1.8 }}>
                    Organizers review incoming attendees in a dedicated telemetry console, mark QR-verified attendance at the gates, and issue cryptographically verifiable digital certificates upon event completion.
                </p>
            </div>

            <div className="about-grid">
                <div className="white-card" style={{ padding: '1.75rem' }}>
                    <div style={{ color: 'var(--primary-orange)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Backend Architecture</div>
                    <h3 style={{ color: 'var(--heading-color)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>Java 21 Spring Boot</h3>
                    <p style={{ color: 'var(--body-text)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                        Enterprise REST controllers, Spring Security stateless JWT filters, and Spring Data JPA repositories with transaction management.
                    </p>
                </div>

                <div className="white-card" style={{ padding: '1.75rem' }}>
                    <div style={{ color: 'var(--status-approved-text)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Persistence Layer</div>
                    <h3 style={{ color: 'var(--heading-color)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>MySQL 8.4 Relational Store</h3>
                    <p style={{ color: 'var(--body-text)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                        ACID transactions, unique compound constraints preventing duplicate registrations, and foreign key cascades.
                    </p>
                </div>

                <div className="white-card" style={{ padding: '1.75rem' }}>
                    <div style={{ color: 'var(--primary-orange)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Frontend Interface</div>
                    <h3 style={{ color: 'var(--heading-color)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>React 19 &amp; Motion Design</h3>
                    <p style={{ color: 'var(--body-text)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                        Crafted with modern responsive layout, word-by-word reveal animations, interactive cards, and a warm white &amp; orange color system.
                    </p>
                </div>
            </div>
        </div>
    );
}
