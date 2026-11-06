import { NavLink } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="clean-footer">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-brand-col">
                        <div className="footer-logo">
                            College<span style={{ color: 'var(--primary-orange)' }}>Events</span>
                        </div>
                        <p className="footer-tagline">
                            Unified University Event Operations & Student Engagement Platform. Powered by Java 21 Spring Boot and MySQL.
                        </p>
                    </div>

                    <div className="footer-links-col">
                        <h4>Navigation</h4>
                        <ul>
                            <li><NavLink to="/">Public Home</NavLink></li>
                            <li><NavLink to="/events">Events Directory</NavLink></li>
                            <li><NavLink to="/gallery">Campus Gallery</NavLink></li>
                            <li><NavLink to="/verify-certificate">Verify Certificate</NavLink></li>
                        </ul>
                    </div>

                    <div className="footer-links-col">
                        <h4>Portals</h4>
                        <ul>
                            <li><NavLink to="/login">Student Login</NavLink></li>
                            <li><NavLink to="/register">Student Sign Up</NavLink></li>
                            <li><NavLink to="/organizer-login">Faculty Organizer</NavLink></li>
                            <li><NavLink to="/admin-login">System Admin</NavLink></li>
                        </ul>
                    </div>

                    <div className="footer-links-col">
                        <h4>Coordination Cell</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--body-text)', margin: '0 0 0.5rem 0' }}>
                            Room 204, Student Activity Center<br />
                            Technology Campus, Hyd - 500032
                        </p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--body-text)', margin: 0 }}>
                            Desk: +91 (040) 2345-6789<br />
                            Email: events@college.edu
                        </p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>College Event Management System &copy; {new Date().getFullYear()}</span>
                    <span>Verified Relational Persistence &bull; MySQL 8.4</span>
                </div>
            </div>
        </footer>
    );
}
