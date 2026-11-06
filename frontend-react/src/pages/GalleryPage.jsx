import { useEffect, useState } from 'react';
import Masonry from '../components/Masonry/Masonry';
import { Api } from '../services/api';
import { showToast } from '../components/Toast';

export default function GalleryPage() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Api.gallery.getPhotos().then((res) => {
            if (res.data) setPhotos(res.data);
            setLoading(false);
        }).catch((err) => {
            showToast('Could not load gallery: ' + err.message, 'error');
            setLoading(false);
        });
    }, []);

    return (
        <div className="section-container">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <span className="brand-badge" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
                    Centurion University AP &bull; Vizianagaram
                </span>
                <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--heading-color)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                    Official Campus <span style={{ color: 'var(--primary-orange)' }}>Event Gallery</span>
                </h1>
                <p style={{ color: 'var(--body-text)', maxWidth: '680px', margin: '0.5rem auto 0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
                    Authentic photographs from official Centurion University of Technology and Management, AP (Vizianagaram Campus) across Technical Events, Hackathons, Workshops, Sports, Seminars, Guest Lectures, Social Service, and Campus Life.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--body-text)' }}>
                    Loading photographs from server...
                </div>
            ) : (
                <Masonry items={photos} columns={3} />
            )}
        </div>
    );
}
