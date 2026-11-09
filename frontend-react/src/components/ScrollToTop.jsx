import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop guarantees that whenever route/pathname changes,
 * the window and document scroll offset resets immediately to (0, 0)
 * on all mobile and desktop viewports.
 */
export default function ScrollToTop() {
    const { pathname, search, hash } = useLocation();

    // Synchronous reset before browser paint
    useLayoutEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            if (document.documentElement) document.documentElement.scrollTop = 0;
            if (document.body) document.body.scrollTop = 0;
        }
    }, [pathname, search, hash]);

    // Secondary assurance after DOM hydration/render
    useEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            if (document.documentElement) document.documentElement.scrollTop = 0;
            if (document.body) document.body.scrollTop = 0;
        } else {
            const el = document.getElementById(hash.replace('#', ''));
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [pathname, search, hash]);

    return null;
}

