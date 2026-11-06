import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ParticleBackground from './components/ParticleBackground';

// Public Pages
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import GalleryPage from './pages/GalleryPage';
import CertificateVerify from './pages/CertificateVerify';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import OrganizerLogin from './pages/OrganizerLogin';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyRegistrations from './pages/student/MyRegistrations';
import EventCalendar from './pages/student/EventCalendar';
import StudentCertificates from './pages/student/StudentCertificates';
import StudentProfile from './pages/student/StudentProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRegistrations from './pages/admin/AdminRegistrations';
import AdminEvents from './pages/admin/AdminEvents';
import AdminStudents from './pages/admin/AdminStudents';
import AdminOrganizers from './pages/admin/AdminOrganizers';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminGallery from './pages/admin/AdminGallery';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminReports from './pages/admin/AdminReports';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';

// Organizer Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import OrganizerEvents from './pages/organizer/OrganizerEvents';
import OrganizerAttendance from './pages/organizer/OrganizerAttendance';
import OrganizerAnnouncements from './pages/organizer/OrganizerAnnouncements';

export default function App() {
    return (
        <AuthProvider>
            <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <ParticleBackground />
                <ToastContainer />
                <Navbar />

                <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/events/:id" element={<EventDetails />} />
                        <Route path="/gallery" element={<GalleryPage />} />
                        <Route path="/verify-certificate" element={<CertificateVerify />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/admin-login" element={<AdminLogin />} />
                        <Route path="/organizer-login" element={<OrganizerLogin />} />

                        {/* Student Routes */}
                        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
                        <Route path="/student/dashboard" element={
                            <ProtectedRoute role="ROLE_STUDENT"><StudentDashboard /></ProtectedRoute>
                        } />
                        <Route path="/student/registrations" element={<Navigate to="/student/my-registrations" replace />} />
                        <Route path="/student/my-registrations" element={
                            <ProtectedRoute role="ROLE_STUDENT"><MyRegistrations /></ProtectedRoute>
                        } />
                        <Route path="/student/calendar" element={
                            <ProtectedRoute role="ROLE_STUDENT"><EventCalendar /></ProtectedRoute>
                        } />
                        <Route path="/student/certificates" element={
                            <ProtectedRoute role="ROLE_STUDENT"><StudentCertificates /></ProtectedRoute>
                        } />
                        <Route path="/student/profile" element={
                            <ProtectedRoute role="ROLE_STUDENT"><StudentProfile /></ProtectedRoute>
                        } />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="/admin/dashboard" element={
                            <ProtectedRoute role="ROLE_ADMIN"><AdminDashboard /></ProtectedRoute>
                        } />
                        <Route path="/admin/registrations" element={
                            <ProtectedRoute role="ROLE_ADMIN"><AdminRegistrations /></ProtectedRoute>
                        } />
                        <Route path="/admin/events" element={
                            <ProtectedRoute role="ROLE_ADMIN"><AdminEvents /></ProtectedRoute>
                        } />
                        <Route path="/admin/students" element={
                            <ProtectedRoute role="ROLE_ADMIN"><AdminStudents /></ProtectedRoute>
                        } />
                        <Route path="/admin/organizers" element={
                            <ProtectedRoute role="ROLE_ADMIN"><AdminOrganizers /></ProtectedRoute>
                        } />
                        <Route path="/admin/attendance" element={
                            <ProtectedRoute role="ROLE_ADMIN"><AdminAttendance /></ProtectedRoute>
                        } />
                        <Route path="/admin/certificates" element={
                            <ProtectedRoute role="ROLE_ADMIN"><AdminCertificates /></ProtectedRoute>
                        } />
                        <Route path="/admin/gallery" element={
                            <ProtectedRoute role="ROLE_ADMIN"><AdminGallery /></ProtectedRoute>
                        } />
                        <Route path="/admin/announcements" element={
                            <ProtectedRoute role="ROLE_ADMIN"><AdminAnnouncements /></ProtectedRoute>
                        } />
                        <Route path="/admin/reports" element={
                            <ProtectedRoute role="ROLE_ADMIN"><AdminReports /></ProtectedRoute>
                        } />
                        <Route path="/admin/logs" element={<Navigate to="/admin/audit-logs" replace />} />
                        <Route path="/admin/audit-logs" element={
                            <ProtectedRoute role="ROLE_ADMIN"><AdminAuditLogs /></ProtectedRoute>
                        } />

                        {/* Organizer Routes */}
                        <Route path="/organizer" element={<Navigate to="/organizer/dashboard" replace />} />
                        <Route path="/organizer/dashboard" element={
                            <ProtectedRoute role="ROLE_ORGANIZER"><OrganizerDashboard /></ProtectedRoute>
                        } />
                        <Route path="/organizer/events" element={
                            <ProtectedRoute role="ROLE_ORGANIZER"><OrganizerEvents /></ProtectedRoute>
                        } />
                        <Route path="/organizer/attendance" element={
                            <ProtectedRoute role="ROLE_ORGANIZER"><OrganizerAttendance /></ProtectedRoute>
                        } />
                        <Route path="/organizer/announcements" element={
                            <ProtectedRoute role="ROLE_ORGANIZER"><OrganizerAnnouncements /></ProtectedRoute>
                        } />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </AuthProvider>
    );
}
